import express from 'express';

import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { validateHostVenueOwnership } from "../../middlewares/validateHostVenueOwnership.middleware.js"

import { updateVenue, setVenueType, setVenueFeatures, addVenuePhotos, reorderPhotos, setPricing, submitVenue } from '../../controllers/venueControllers/venue.controller.js';

const router = express.Router();

router.use(checkForAuthenticationCookie("token"));

router.put('/:venueId', validateHostVenueOwnership, hasPermission("Venue" , "UPDATE"), updateVenue);

router.put('/:venueId/type' , validateHostVenueOwnership, hasPermission("VenueType", "UPDATE"), setVenueType);

router.put('/:venueId/features', validateHostVenueOwnership, hasPermission("VenueFeature", "UPDATE"), setVenueFeatures);

router.post('/:venueId/photos', validateHostVenueOwnership, hasPermission("VenuePhoto", "CREATE"), addVenuePhotos);

router.put('/:venueId/photos/reorder', validateHostVenueOwnership, hasPermission("VenuePhoto", "UPDATE"), reorderPhotos);

router.put('/:venueId/pricing', validateHostVenueOwnership, hasPermission("VenuePricingRule", "UPDATE"), setPricing);

router.put('/:venueId/submit', validateHostVenueOwnership, hasPermission("Venue", "UPDATE"), submitVenue);

export default router;