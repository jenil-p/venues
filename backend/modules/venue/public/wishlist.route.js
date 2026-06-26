import express from 'express';
import { checkForAuthenticationCookie } from '../../../middlewares/authentication.middleware.js';
import { validate } from '../../../middlewares/validate.middleware.js';
import { toggleWishlist, getUserWishlistController } from './wishlist.controller.js';

const router = express.Router();

// Toggle (add/remove) wishlist for a venue
router.post('/venues/:venueId/toggle', checkForAuthenticationCookie("token"), toggleWishlist);

// Get user's wishlist
router.get('/my-wishlist', checkForAuthenticationCookie("token"), getUserWishlistController);

export default router;