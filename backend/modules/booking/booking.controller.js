import { createBooking, proceedToPayment, cancelBooking, getBookingById } from './booking.service.js';

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

export async function proceedToPaymentController(req, res) {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;
    const booking = await proceedToPayment({ bookingId, userId });


    return res.status(200).json({
      booking,
      message: "Proceeded to payment. Timer started.",
      expiresAt: booking.expiresAt
    });
  } catch (error) {
      console.error("Proceed to payment error:", error);
      if (error.status) {
          return res.status(error.status).json({ message: error.message });
      }
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

export async function getBookingByIdController(req, res) {
  const { bookingId } = req.params;
  const userId = req.user.id;

  const result = await getBookingById({bookingId, userId});
  return res.status(200).json(result);
}