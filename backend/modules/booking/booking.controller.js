import { createBooking } from './booking.service.js';

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