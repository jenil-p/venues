import express from 'express';

import { checkForAuthenticationCookie } from "../../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../../middlewares/permission.middleware.js";
import { validateProviderVenueOwnership } from "../../../middlewares/validateProviderVenueOwnership.middleware.js"

import { createFullVenue, updateVenue, setVenueType, setVenueFeatures, addVenuePhotos, reorderPhotos, setPricing, getVenue, getAllVenues, deleteVenue, deletePhoto } from './venue.controller.js';

const router = express.Router();

router.use(checkForAuthenticationCookie("token"));

// create full venue
router.post('/' , checkForAuthenticationCookie("token") , hasPermission("Venue" , "CREATE") , createFullVenue);

// update venue
router.put('/:venueId', hasPermission("Venue" , "UPDATE"), validateProviderVenueOwnership, updateVenue);

router.put('/:venueId/type' , hasPermission("VenueType" , "UPDATE"), validateProviderVenueOwnership, setVenueType);

router.put('/:venueId/features', hasPermission("VenueFeature" , "UPDATE"), validateProviderVenueOwnership, setVenueFeatures);

router.post('/:venueId/photos', hasPermission("VenuePhoto" , "CREATE"), validateProviderVenueOwnership, addVenuePhotos);

router.put('/:venueId/photos/reorder', hasPermission("VenuePhoto" , "UPDATE"), validateProviderVenueOwnership, reorderPhotos);

router.put('/:venueId/pricing', hasPermission("VenuePricingRule" , "UPDATE"), validateProviderVenueOwnership, setPricing);

router.get('/:venueId' , validateProviderVenueOwnership , getVenue);

// get venue/venues
router.get('/' , getAllVenues);

router.delete('/:venueId', hasPermission("Venue" , "DELETE"), validateProviderVenueOwnership , deleteVenue);

// delete venue
router.delete('/:venueId/photos/:photoId', hasPermission("VenuePhoto", "DELETE") , validateProviderVenueOwnership , deletePhoto);

export default router;