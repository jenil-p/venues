import { createBooking, cancelBooking, revertToCart, getBookingById, getUserBookings } from './booking.service.js';

export async function makeBooking(req, res) {
    try {
        const { venueId } = req.params;
        const userId = req.user.id;
        const { noOfGuest, startTime, endTime } = req.body;

        const result = await createBooking({ venueId, userId, noOfGuest, startTime, endTime });

        return res.status(201).json(result);

    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        console.error("makeBooking error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function cancelBookingController(req, res) {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const result = await cancelBooking({ bookingId, userId });
    return res.status(200).json({ message: "Booking cancelled", booking: result });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function revertToCartController(req, res) {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const result = await revertToCart({ bookingId, userId });
    // console.log(result);
    return res.status(200).json({ message: "Booking reverted to cart", booking: result });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getBookingByIdController(req, res) {
  const { bookingId } = req.params;
  const userId = req.user.id;

  const result = await getBookingById({bookingId, userId});
  return res.status(200).json(result);
}

export async function getUserBookingsController(req, res) {
    try {
        const userId = req.user.id;
        const { status, page = 1, limit = 20 } = req.query;

        const result = await getUserBookings({ 
            userId, 
            status, 
            page: parseInt(page), 
            limit: parseInt(limit) 
        });

        return res.status(200).json(result);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("getUserBookings error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}