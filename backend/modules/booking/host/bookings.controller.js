import { getHostBookings, getHostBookingById, getHostBookingsStats, getProviderId } from './bookings.service.js';

export async function getHostBookingsController(req, res) {
    try {
        
        const userId = Number(req.user.id)
        const providerId = await getProviderId(userId);

        const { status, venueId, startDate, endDate, page = 1, limit = 20 } = req.query;

        const result = await getHostBookings({ 
            providerId, 
            status, 
            venueId: venueId ? parseInt(venueId) : null,
            startDate, 
            endDate,
            page: parseInt(page), 
            limit: parseInt(limit) 
        });

        return res.status(200).json(result);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("getHostBookings error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getHostBookingByIdController(req, res) {
    try {
        const userId = Number(req.user.id)
        const providerId = await getProviderId(userId);

        const { bookingId } = req.params;

        if (!providerId) {
            return res.status(403).json({ message: "Provider profile not found" });
        }

        const result = await getHostBookingById({ providerId, bookingId: Number(bookingId) });
        return res.status(200).json(result);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("getHostBookingById error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getHostBookingsStatsController(req, res) {
    try {
        const userId = Number(req.user.id)
        const providerId = await getProviderId(userId);

        if (!providerId) {
            return res.status(403).json({ message: "Provider profile not found" });
        }

        const stats = await getHostBookingsStats(providerId);
        return res.status(200).json({ stats });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("getHostBookingsStats error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}