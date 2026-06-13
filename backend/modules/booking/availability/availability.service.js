import prisma from '../../../prisma/client.js';

const pending_expiry_minutes = process.env.PENDING_PAYMENT_EXPIRY_MINUTES

export async function fetchBlockedSlots(venueId, windowStart, windowEnd) {
    const expiryThreshold = new Date(Date.now() - pending_expiry_minutes * 60 * 1000);

    const blocked = await prisma.booking.findMany({
        where: {
            venueId,
            AND: [
                { startTime: { lt: windowEnd } },
                { endTime:   { gt: windowStart } },
            ],
            OR: [
                { bookingStatus: 'CONFIRMED' },
                {
                    bookingStatus: 'PENDING_PAYMENT',
                    createdAt:     { gt: expiryThreshold },
                },
            ],
        },
        select: {
            startTime:     true,
            endTime:       true,
            bookingStatus: true,
        },
        orderBy: {
            startTime: 'asc',
        },
    });

    return blocked;
}


export async function isSlotAvailable(tx, venueId, startTime, endTime) {
    const expiryThreshold = new Date(Date.now() - pending_expiry_minutes * 60 * 1000);

    const conflict = await tx.booking.findFirst({
        where: {
            venueId,
            AND: [
                { startTime: { lt: endTime } },
                { endTime:   { gt: startTime } },
            ],
            OR: [
                { bookingStatus: 'CONFIRMED' },
                {
                    bookingStatus: 'PENDING_PAYMENT',
                    createdAt:     { gt: expiryThreshold },
                },
            ],
        },
    });

    return conflict === null;
}