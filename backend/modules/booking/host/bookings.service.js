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
        return res.status(403).json({ message: "Only approved provider can manage venues" });
    }

    return provider.id;
}