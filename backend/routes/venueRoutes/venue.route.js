import express from 'express';

import { checkForAuthenticationCookie } from "../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../middlewares/permission.middleware.js";
import { validateProviderVenueOwnership } from "../../middlewares/validateProviderVenueOwnership.middleware.js"

import { updateVenue, setVenueType, setVenueFeatures, addVenuePhotos, reorderPhotos, setPricing, submitVenue } from '../../controllers/venueControllers/venue.controller.js';

const router = express.Router();

router.use(checkForAuthenticationCookie("token"));

router.put('/:venueId', validateProviderVenueOwnership, updateVenue);

router.put('/:venueId/type' , validateProviderVenueOwnership, setVenueType);

router.put('/:venueId/features', validateProviderVenueOwnership, setVenueFeatures);

router.post('/:venueId/photos', validateProviderVenueOwnership, addVenuePhotos);

router.put('/:venueId/photos/reorder', validateProviderVenueOwnership, reorderPhotos);

router.put('/:venueId/pricing', validateProviderVenueOwnership, setPricing);

router.put('/:venueId/submit', validateProviderVenueOwnership, submitVenue);

export default router;