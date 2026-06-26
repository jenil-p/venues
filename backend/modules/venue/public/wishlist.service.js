import prisma from '../../../prisma/client.js';

export async function toggleWishlistItem({ venueId, userId }) {
    // Check if venue exists and is active
    const venue = await prisma.venue.findUnique({
        where: { id: Number(venueId) },
        select: { id: true, status: true }
    });

    if (!venue) {
        const err = new Error("Venue not found"); 
        err.status = 404; 
        throw err;
    }

    if (!['ACTIVE'].includes(venue.status)) {
        const err = new Error("This venue is not available for wishlist"); 
        err.status = 400; 
        throw err;
    }

    const existing = await prisma.wishlist.findUnique({
        where: {
            userId_venueId: { userId: Number(userId), venueId: Number(venueId) }
        }
    });

    if (existing) {
        // Remove from wishlist
        await prisma.wishlist.delete({
            where: { id: existing.id }
        });
        return { 
            message: "Venue removed from wishlist", 
            isWishlisted: false 
        };
    } else {
        // Add to wishlist
        await prisma.wishlist.create({
            data: {
                userId: Number(userId),
                venueId: Number(venueId)
            }
        });
        return { 
            message: "Venue added to wishlist", 
            isWishlisted: true 
        };
    }
}

export async function getUserWishlist({ userId, page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const [wishlists, total] = await Promise.all([
        prisma.wishlist.findMany({
            where: { userId: Number(userId) },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                venue: {
                    select: {
                        id: true,
                        venuename: true,
                        description: true,
                        capacity: true,
                        status: true,
                        photos: { 
                            take: 1, 
                            orderBy: { order: 'asc' } 
                        },
                        address: {
                            select: {
                                location: true,
                                city: { select: { name: true } }
                            }
                        },
                    }
                }
            }
        }),
        prisma.wishlist.count({ where: { userId: Number(userId) } })
    ]);

    return {
        wishlists,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    };
}