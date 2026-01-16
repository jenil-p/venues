import express from 'express';

import { checkForAuthenticationCookie } from "../../../middlewares/authentication.middleware.js";
import { hasPermission } from "../../../middlewares/permission.middleware.js";
import { validateProviderVenueOwnership } from "../../../middlewares/validateProviderVenueOwnership.middleware.js"

import { updateVenue, setVenueType, setVenueFeatures, addVenuePhotos, reorderPhotos, setPricing, getVenue, getAllVenues, deleteVenue, deletePhoto } from '../../../controllers/providerControllers/venueControllers/venue.controller.js';

const router = express.Router();

router.use(checkForAuthenticationCookie("token"));

router.put('/:venueId', hasPermission("Venue" , "UPDATE"), validateProviderVenueOwnership, updateVenue);

router.put('/:venueId/type' , hasPermission("VenueType" , "UPDATE"), validateProviderVenueOwnership, setVenueType);

router.put('/:venueId/features', hasPermission("VenueFeature" , "UPDATE"), validateProviderVenueOwnership, setVenueFeatures);

router.post('/:venueId/photos', hasPermission("VenuePhoto" , "CREATE"), validateProviderVenueOwnership, addVenuePhotos);

router.put('/:venueId/photos/reorder', hasPermission("VenuePhoto" , "UPDATE"), validateProviderVenueOwnership, reorderPhotos);

router.put('/:venueId/pricing', hasPermission("VenuePricingRule" , "UPDATE"), validateProviderVenueOwnership, setPricing);

router.get('/:venueId' , validateProviderVenueOwnership , getVenue);

router.get('/' , getAllVenues);

router.delete('/:venueId', hasPermission("Venue" , "DELETE"), validateProviderVenueOwnership , deleteVenue);

router.delete('/:venueId/photos/:photoId', hasPermission("VenuePhoto", "DELETE") , validateProviderVenueOwnership , deletePhoto);

export default router;