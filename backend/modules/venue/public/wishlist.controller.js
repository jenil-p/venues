import { toggleWishlistItem, getUserWishlist } from './wishlist.service.js';

export async function toggleWishlist(req, res) {
    try {
        const { venueId } = req.params;
        const userId = req.user.id;

        const result = await toggleWishlistItem({ venueId, userId });

        return res.status(200).json(result);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        console.error("toggleWishlist error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getUserWishlistController(req, res) {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;

        const result = await getUserWishlist({ 
            userId, 
            page: parseInt(page), 
            limit: parseInt(limit) 
        });

        return res.status(200).json(result);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("getUserWishlist error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}