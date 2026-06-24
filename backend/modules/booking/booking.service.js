import prisma from '../../prisma/client.js';
import { isSlotAvailable } from './availability/availability.service.js';

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


const PENDING_PAYMENT_TTL_MS = process.env.PENDING_PAYMENT_EXPIRY_MINUTES * 60 * 1000;

// move from CART --> PAYMENT_PENDING state
export async function proceedToPayment({ bookingId, userId }) {
    return prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUnique({ where: { id: bookingId } });

        if (!booking || booking.userId !== userId) {
            const err = new Error("Booking not found"); 
            err.status = 404; 
            throw err;
        }

        if (booking.bookingStatus === 'PENDING_PAYMENT') { // if user had closed the payment page, but not cacelled the booking...
            if (booking.expiresAt && booking.expiresAt > new Date()) {
                return booking;
            }
            const err = new Error("Payment window expired, please re-add to cart");
            err.status = 409;
            throw err;
        }

        if (booking.bookingStatus !== 'CART') {
            const err = new Error("This booking cannot proceed to payment");
            err.status = 400; throw err;
        }

        // this is where the transaction use comes. (to prevent race condition...) for multiple users going to book one slot...
        const available = await isSlotAvailable(
            tx, booking.venueId, booking.startTime, booking.endTime
        );
        if (!available) {
            const err = new Error("This slot was just taken by someone else");
            err.status = 409; throw err;
        }

        return tx.booking.update({
            where: { id: bookingId },
            data: {
                bookingStatus: 'PENDING_PAYMENT',
                expiresAt: new Date(Date.now() + PENDING_PAYMENT_TTL_MS),
            },
        });
    });
}


// Cancel booking 
export async function cancelBooking({ bookingId, userId }) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking || booking.userId !== userId) {
        const err = new Error("Booking not found"); err.status = 404; throw err;
    }
    if (!['CART', 'PENDING_PAYMENT'].includes(booking.bookingStatus)) {
        const err = new Error("This booking can no longer be cancelled");
        err.status = 400; throw err;
    }

    return prisma.booking.update({
        where: { id: bookingId },
        data: { bookingStatus: 'CANCELLED', expiresAt: null },
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