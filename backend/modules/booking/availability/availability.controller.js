import { fetchBlockedSlots } from './availability.service.js';

export async function getVenueAvailability(req, res) {
    try {
        const venueId = parseInt(req.params.venueId);
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({ message: "year and month query params are required" });
        }

        const y = parseInt(year);
        const m = parseInt(month); // 1-indexed

        if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
            return res.status(400).json({ message: "Invalid year or month" });
        }

        // checking month wise (this could be two monthly as per UI ... will think of it...)
        const windowStart = new Date(y, m - 1, 1, 0, 0, 0, 0);
        const windowEnd   = new Date(y, m,     0, 23, 59, 59, 999);

        const blockedSlots = await fetchBlockedSlots(venueId, windowStart, windowEnd);

        return res.status(200).json({
            venueId,
            year: y,
            month: m,
            blockedSlots,
        });

    } catch (error) {
        console.error("getVenueAvailability error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}