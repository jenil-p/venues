import express from 'express';
import { 
  getVenueTypes, 
  getVenueFeatures, 
  getLocationOptions,
  getAllVenueFormOptions,
  getAllServiceCategories
} from './resource.controller.js';

const router = express.Router();

router.get('/venue-types', getVenueTypes);
router.get('/venue-features', getVenueFeatures);
router.get('/locations', getLocationOptions);
router.get('/form-options', getAllVenueFormOptions);

router.get('/service-categories' , getAllServiceCategories);

export default router;