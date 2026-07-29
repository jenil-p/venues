import prisma from '../../prisma/client.js';
import { isSlotAvailable } from './availability/availability.service.js';
import { enqueueNotification } from '../../queues/notification.queue.js';

// this function is for internal use (not to get exported :)
function calculateTotalCost(pricingRules, startTime, endTime) {
    const start = new Date(startTime);
    const end   = new Date(endTime);
    const diffMs    = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays  = diffHours / 24;

    // here first priority is for daily pricing rule... 
    // if not then will fall back to hourly 
    const dailyRule  = pricingRules.find(r => r.unit === 'DAILY');
    const hourlyRule = pricingRules.find(r => r.unit === 'HOURLY');

    if (dailyRule) {
        const days = Math.ceil(diffDays);
        return { pricePerUnit: Number(dailyRule.price), totalCost: Number(dailyRule.price) * days, unit: 'DAILY' };
    }

    if (hourlyRule) {
        const hours = Math.ceil(diffHours);
        return { pricePerUnit: Number(hourlyRule.price), totalCost: Number(hourlyRule.price) * hours, unit: 'HOURLY' };
    }

    throw new Error("No pricing rule found for this venue");
}

// create booking (make the entry - CART)
export async function createBooking({ venueId, userId, noOfGuest, startTime, endTime }) {
    // venue exists and is ACTIVE and has enough capacity
    const venue = await prisma.venue.findUnique({
        where: { id: venueId },
        select: { id: true, status: true, capacity: true, pricing: true },
    });

    if (!venue) {
        const err = new Error("Venue not found"); err.status = 404; throw err;
    }
    if (venue.status !== 'ACTIVE') {
        const err = new Error("This venue is not available for booking"); err.status = 400; throw err;
    }
    if (noOfGuest > venue.capacity) {
        const err = new Error(`Guest count exceeds venue capacity of ${venue.capacity}`); err.status = 400; throw err;
    }

    // Calculate cost
    const { pricePerUnit, totalCost, unit } = calculateTotalCost(venue.pricing, startTime, endTime);

    // availability check + booking creation inside a transaction (to handle race condition)
    const booking = await prisma.$transaction(async (tx) => {
        const available = await isSlotAvailable(tx, venueId, new Date(startTime), new Date(endTime), userId);

        if (!available) {
            const err = new Error("This slot is already booked for this venue"); err.status = 409; throw err;
        }

        return tx.booking.create({
            data: {
                venueId,
                userId,
                startTime:              new Date(startTime),
                endTime:                new Date(endTime),
                numberOfGuestsExpected: noOfGuest,
                pricePerUnit,
                totalCost,
                bookingStatus:          'CART',
            },
            select: {
                id:                     true,
                startTime:              true,
                endTime:                true,
                numberOfGuestsExpected: true,
                pricePerUnit:           true,
                totalCost:              true,
                bookingStatus:          true,
                createdAt:              true,
                venue: {
                    select: { id: true, venuename: true }
                },
            },
        });
    });

    return { booking, expiresAt: null };
}


export async function cancelBooking({ bookingId, userId }) {
    const booking = await prisma.booking.findUnique({ 
        where: { id: bookingId } 
    });

    if (!booking || booking.userId !== userId) {
        const err = new Error("Booking not found"); 
        err.status = 404; 
        throw err;
    }

    const now = new Date();
    if (booking.bookingStatus === 'CONFIRMED' && new Date(booking.startTime) <= now) {
        const err = new Error("The slot duration has already started and cannot be cancelled.");
        err.status = 400; 
        throw err;
    }

    // if booking is in cart/pending payment stage then it has to be converted into CART back not cancel...
    if(['CART', 'PENDING_PAYMENT'].includes(booking.bookingStatus)){
        const err = new Error("This booking can not be cancelled");
        err.status = 400; 
        throw err; 
    }

    if (booking.bookingStatus !== 'CONFIRMED') {
        const err = new Error("This booking can no longer be cancelled");
        err.status = 400; 
        throw err;
    }

    const cancelled = await prisma.booking.update({
        where: { id: bookingId },
        data: { 
            bookingStatus: 'CANCELLED', 
            expiresAt: null 
        },
        include: {
            venue: { select: { venuename: true } },
            user: { select: { fullname: true, email: true } },
        },
    });

    // Best-effort notify user about cancellation — must not break the cancel flow
    try {
        if (cancelled.user?.email) {
            await enqueueNotification({
                type: "booking_cancelled_user",
                data: {
                    email: cancelled.user.email,
                    userName: cancelled.user.fullname,
                    venueName: cancelled.venue.venuename,
                    startTime: cancelled.startTime,
                    bookingId: cancelled.id,
                },
            });
        }
    } catch (notifErr) {
        console.warn("[cancel] failed to enqueue cancellation notification:", notifErr.message);
    }

    return cancelled;
}

export async function revertToCart({ bookingId, userId }) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking || booking.userId !== userId) {
        const err = new Error("Booking not found"); err.status = 404; throw err;
    }
    if (!['CART', 'PENDING_PAYMENT'].includes(booking.bookingStatus)) { // here only PENDING_PAYMENT is nessesory... but CART is just in case...
        const err = new Error("This booking can no longer be converted to cart");
        err.status = 400; throw err;
    }

    return prisma.booking.update({
        where: { id: bookingId },
        data: { bookingStatus: 'CART', expiresAt: null },
    });
}

export async function getBookingById({bookingId, userId}) {
    bookingId = Number(bookingId);
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking || booking.userId !== userId) {
        const err = new Error("Booking not found"); err.status = 404; throw err;
    }
    
    return booking;
}

export async function getUserBookings({ userId, status = null }) {

    const where = {
        userId,
        NOT: {
            bookingStatus: { in: ['CART', 'PENDING_PAYMENT'] }
        }
    };

    if (status) {
        where.bookingStatus = status;
    }

    const bookings = await prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            venue: {
                select: {
                    id: true,
                    venuename: true,
                    photos: { take: 1, orderBy: { order: 'asc' } },
                    address: {
                        select: {
                            city: { select: { name: true } },
                            location: true
                        }
                    }
                }
            },
            payment: true,
        }
    });

    return { bookings };
}