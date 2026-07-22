import prisma from '../../../prisma/client.js';

export async function getHostBookings({ providerId, status, venueId, startDate, endDate, page = 1, limit = 20 }) {
    const where = {
        venue: {
            providerId: parseInt(providerId)
        }
    };

    if (status) {
        where.bookingStatus = Array.isArray(status) ? { in: status } : status;
    }

    if (venueId) {
        where.venueId = parseInt(venueId);
    }

    if (startDate || endDate) {
        where.startTime = {};
        if (startDate) where.startTime.gte = new Date(startDate);
        if (endDate) where.startTime.lte = new Date(endDate);
    }

    const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
            where,
            // skip: (page - 1) * limit,
            // take: limit,
            orderBy: { startTime: 'desc' },
            include: {
                venue: {
                    select: {
                        id: true,
                        venuename: true,
                        capacity: true,
                        photos: { take: 1, orderBy: { order: 'asc' } }
                    }
                },
                user: {
                    select: {
                        id: true,
                        fullname: true,
                        contactnumber: true
                    }
                },
                payment: true,
                services: {
                    include: {
                        service: {
                            select: { id: true, name: true }
                        }
                    }
                }
            }
        }),
        prisma.booking.count({ where })
    ]);

    return {
        bookings,
        // pagination: {
        //     page: parseInt(page),
        //     limit: parseInt(limit),
        //     // total,
        //     // totalPages: Math.ceil(total / limit)
        // }
    };
}

export async function getHostBookingById({ providerId, bookingId }) {

    const booking = await prisma.booking.findFirst({
        where: { id: bookingId },
        include: {
            venue: {
                select: {
                    id: true,
                    providerId: true,
                    venuename: true,
                    description: true,
                    capacity: true,
                    address: true,
                    photos: true
                }
            },
            user: {
                select: {
                    id: true,
                    fullname: true,
                    contactnumber: true,
                    email: true
                }
            },
            payment: true,
            services: {
                include: {
                    service: true
                }
            }
        }
    });

    if (!booking || booking.venue.providerId !== parseInt(providerId)) {
        const err = new Error("Booking not found or not authorized");
        err.status = 404;
        throw err;
    }

    return booking;
}

export async function getHostBookingsStats(providerId) {
    const stats = await prisma.booking.groupBy({
        by: ['bookingStatus'],
        where: {
            venue: { providerId: parseInt(providerId) }
        },
        _count: { id: true },
        _sum: { totalCost: true }
    });

    const totalRevenue = await prisma.booking.aggregate({
        where: {
            venue: { providerId: parseInt(providerId) },
            bookingStatus: { in: ['CONFIRMED', 'COMPLETED'] }
        },
        _sum: { totalCost: true }
    });

    return {
        statusBreakdown: stats,
        totalRevenue: totalRevenue._sum.totalCost || 0
    };
}

export async function getProviderId(userId) {

    const provider = await prisma.providerProfile.findUnique({
        where: {
            userId: userId,
        }
    })

    if (!provider || provider.status !== "APPROVED") {
        const err = new Error("Only approved provider can manage venues");
        err.status = 403;
        throw err;
    }

    return provider.id;
}

function buildMonthlySeries(rawRows, monthsBack, mode) {
    // mode: 'revenue' or 'count'
    const now = new Date();
    const months = [];
    for (let i = monthsBack - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString('en-US', { month: 'short' }), value: 0 });
    }
    const map = new Map(months.map(m => [m.key, m]));
    for (const row of rawRows) {
        const d = new Date(row.month);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const entry = map.get(key);
        if (entry) entry.value = mode === 'count' ? Number(row.count) : Number(row.revenue);
    }
    const valueKey = mode === 'count' ? 'bookings' : 'revenue';
    return months.map(({ label, value }) => ({ month: label, [valueKey]: value }));
}

export async function getDashboardOverview(providerId) {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
        revenueAgg,
        thisMonthAgg,
        lastMonthAgg,
        activeBookings,
        pendingBookings,
        totalVenues,
        totalServices,
        reviewAgg,
        upcoming,
        recentBookings,
        venuesSummary,
        revenueTrendRaw
    ] = await Promise.all([
        prisma.booking.aggregate({
            where: { venue: { providerId }, bookingStatus: { in: ['CONFIRMED', 'COMPLETED'] } },
            _sum: { totalCost: true }
        }),
        prisma.booking.aggregate({
            where: { venue: { providerId }, bookingStatus: { in: ['CONFIRMED', 'COMPLETED'] }, startTime: { gte: startOfThisMonth } },
            _sum: { totalCost: true }
        }),
        prisma.booking.aggregate({
            where: { venue: { providerId }, bookingStatus: { in: ['CONFIRMED', 'COMPLETED'] }, startTime: { gte: startOfLastMonth, lt: startOfThisMonth } },
            _sum: { totalCost: true }
        }),
        prisma.booking.count({
            where: { venue: { providerId }, bookingStatus: { in: ['CONFIRMED', 'PENDING_PAYMENT'] } }
        }),
        prisma.booking.count({
            where: { venue: { providerId }, bookingStatus: 'PENDING_PAYMENT' }
        }),
        prisma.venue.count({ where: { providerId } }),
        prisma.service.count({ where: { providerId } }),
        prisma.venueReview.aggregate({
            where: { venue: { providerId } },
            _avg: { rating: true },
            _count: { id: true }
        }),
        prisma.booking.findMany({
            where: { venue: { providerId }, bookingStatus: { in: ['CONFIRMED', 'PENDING_PAYMENT'] }, startTime: { gte: now } },
            orderBy: { startTime: 'asc' },
            take: 5,
            include: {
                venue: { select: { id: true, venuename: true } },
                user: { select: { id: true, fullname: true } }
            }
        }),
        prisma.booking.findMany({
            where: { venue: { providerId }, bookingStatus: { not: 'CART' } },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                venue: { select: { id: true, venuename: true } },
                user: { select: { id: true, fullname: true } }
            }
        }),
        prisma.venue.findMany({
            where: { providerId },
            orderBy: { id: 'desc' },
            take: 3,
            include: {
                photos: { take: 1, orderBy: { order: 'asc' } },
                address: { include: { city: true } },
                _count: { select: { bookings: true } }
            }
        }),
        prisma.$queryRaw`
            SELECT date_trunc('month', b."startTime") as month, SUM(b."totalCost") as revenue
            FROM "Booking" b
            JOIN "Venue" v ON v.id = b."venueId"
            WHERE v."providerId" = ${providerId}
              AND b."bookingStatus" IN ('CONFIRMED', 'COMPLETED')
              AND b."startTime" >= ${sixMonthsAgo}
            GROUP BY month
            ORDER BY month ASC
        `
    ]);

    const thisMonthRevenue = Number(thisMonthAgg._sum.totalCost || 0);
    const lastMonthRevenue = Number(lastMonthAgg._sum.totalCost || 0);
    let revenueGrowth = null;
    if (lastMonthRevenue > 0) {
        revenueGrowth = `${(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)}%`;
    } else if (thisMonthRevenue > 0) {
        revenueGrowth = 'New';
    }

    return {
        stats: {
            totalRevenue: Number(revenueAgg._sum.totalCost || 0),
            revenueGrowth,
            activeBookings,
            pendingBookings,
            totalListings: totalVenues + totalServices,
            avgRating: Number(reviewAgg._avg.rating || 0),
            totalReviews: reviewAgg._count.id || 0
        },
        revenueTrend: buildMonthlySeries(revenueTrendRaw, 6, 'revenue'),
        upcoming,
        recentBookings,
        venuesSummary: venuesSummary.map(v => ({
            id: v.id,
            venuename: v.venuename,
            capacity: v.capacity,
            status: v.status,
            location: v.address?.location,
            city: v.address?.city?.name,
            photo: v.photos[0]?.image || null,
            bookingsCount: v._count.bookings
        }))
    };
}

export async function getInsights(providerId) {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [venues, revenueByVenueRaw, monthlyBookingsRaw] = await Promise.all([
        prisma.venue.findMany({
            where: { providerId },
            select: {
                id: true,
                venuename: true,
                rating: true,
                photos: { take: 1, orderBy: { order: 'asc' } },
                _count: { select: { reviews: true } }
            }
        }),
        prisma.$queryRaw`
            SELECT b."venueId" as "venueId", SUM(b."totalCost") as revenue
            FROM "Booking" b
            JOIN "Venue" v ON v.id = b."venueId"
            WHERE v."providerId" = ${providerId}
              AND b."bookingStatus" IN ('CONFIRMED', 'COMPLETED')
            GROUP BY b."venueId"
        `,
        prisma.$queryRaw`
            SELECT date_trunc('month', b."startTime") as month, COUNT(*)::int as count
            FROM "Booking" b
            JOIN "Venue" v ON v.id = b."venueId"
            WHERE v."providerId" = ${providerId}
              AND b."bookingStatus" IN ('CONFIRMED', 'COMPLETED')
              AND b."startTime" >= ${twelveMonthsAgo}
            GROUP BY month
            ORDER BY month ASC
        `
    ]);

    const revenueMap = new Map(revenueByVenueRaw.map(r => [r.venueId, Number(r.revenue)]));

    const revenueByVenue = venues
        .map(v => ({ venueId: v.id, name: v.venuename, revenue: revenueMap.get(v.id) || 0 }))
        .sort((a, b) => b.revenue - a.revenue);

    const venuePerformance = venues
        .map(v => ({
            venueId: v.id,
            name: v.venuename,
            photo: v.photos[0]?.image || null,
            revenue: revenueMap.get(v.id) || 0,
            rating: Number(v.rating) || 0,
            reviewCount: v._count.reviews
        }))
        .sort((a, b) => b.revenue - a.revenue);

    return {
        revenueByVenue,
        monthlyBookings: buildMonthlySeries(monthlyBookingsRaw, 6, 'count'),
        venuePerformance
    };
}