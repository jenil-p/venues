import prisma from "../../../prisma/client.js";
import { getRedisClient } from "../../../redis/client.js";

const VENUE_CACHE_TTL = 120; // seconds

// Cache key helpers 

function getVenuesListCacheKey() {
  // For now, a single key since we don't have dynamic filters.
  // In the future, append a hash of (city, capacity, price range, etc.)
  return "venues:list";
}

function getVenueDetailCacheKey(venueId) {
  return `venues:detail:${venueId}`;
}

//  Public API

/**
 * Get paginated list of active venues, cached in Redis.
 */
export async function getVenues() {
  const cacheKey = getVenuesListCacheKey();
  const redis = getRedisClient();

  // 1. Try cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[cache] HIT ${cacheKey}`);
      return JSON.parse(cached);
    }
  } catch (err) {
    // Redis error — fall through to DB
    console.warn(`[cache] read error for ${cacheKey}:`, err.message);
  }

  console.log(`[cache] MISS ${cacheKey} — querying Postgres`);

  // 2. Cache miss — query database
  const venues = await prisma.venue.findMany({
    select: {
      id: true,
      venuename: true,
      rating: true,
      photos: {
        select: { image: true },
        where: { order: 1 },
      },
      pricing: {
        select: { price: true, unit: true },
      },
      address: {
        select: {
          location: true,
          city: { select: { name: true } },
        },
      },
    },
    where: { status: "ACTIVE" },
  });

  const result = { data: venues };

  // 3. Populate cache (best-effort)
  try {
    await redis.setex(cacheKey, VENUE_CACHE_TTL, JSON.stringify(result));
    console.log(`[cache] SET ${cacheKey} (TTL ${VENUE_CACHE_TTL}s)`);
  } catch (err) {
    console.warn(`[cache] write error for ${cacheKey}:`, err.message);
  }

  return result;
}

/**
 * Get a single venue by id, cached in Redis.
 */
export async function getVenueById(venueId) {
  const cacheKey = getVenueDetailCacheKey(venueId);
  const redis = getRedisClient();

  // 1. Try cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[cache] HIT ${cacheKey}`);
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn(`[cache] read error for ${cacheKey}:`, err.message);
  }

  console.log(`[cache] MISS ${cacheKey} — querying Postgres`);

  // 2. Cache miss — query database
  const venue = await prisma.venue.findUnique({
    where: { id: Number(venueId) },
    select: {
      id: true,
      venuename: true,
      description: true,
      capacity: true,
      contactemail: true,
      contactnumber1: true,
      rating: true,
      providerId: true,

      address: {
        select: {
          location: true,
          postalcode: true,
          city: {
            select: {
              name: true,
              state: {
                select: {
                  name: true,
                  country: { select: { name: true } },
                },
              },
            },
          },
        },
      },

      features: {
        select: {
          feature: { select: { name: true, icon: true } },
        },
      },

      types: {
        select: {
          type: { select: { name: true, icon: true } },
        },
      },

      photos: {
        select: { image: true, description: true },
        orderBy: { order: "asc" },
      },

      pricing: {
        select: { price: true, unit: true },
      },

      reviews: {
        select: {
          rating: true,
          comment: true,
          createdAt: true,
          user: { select: { fullname: true } },
        },
      },
    },
  });

  if (!venue) {
    const err = new Error("Venue not found");
    err.status = 404;
    throw err;
  }

  const result = { data: venue };

  // 3. Populate cache (best-effort)
  try {
    await redis.setex(cacheKey, VENUE_CACHE_TTL, JSON.stringify(result));
    console.log(`[cache] SET ${cacheKey} (TTL ${VENUE_CACHE_TTL}s)`);
  } catch (err) {
    console.warn(`[cache] write error for ${cacheKey}:`, err.message);
  }

  return result;
}
