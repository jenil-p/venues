import { getVenues as getVenuesSvc, getVenueById } from "./venue.service.js";

export async function getVenues(req, res) {
    try {
        const result = await getVenuesSvc();
        return res.status(200).json({
            message: "venues fetched successfully.",
            ...result,
        });
    } catch (error) {
        console.error("getVenues error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getVenue(req, res) {
    const { venueId } = req.params;
    try {
        const result = await getVenueById(venueId);
        return res.status(200).json({
            message: "venue fetched successfully.",
            ...result,
        });
    } catch (error) {
        if (error.status === 404) {
            return res.status(404).json({ message: error.message });
        }
        console.error("getVenue error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}