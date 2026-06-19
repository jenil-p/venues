import express from 'express';
import { 
  getVenueTypes, 
  getVenueFeatures, 
  getLocationOptions,
  getAllVenueFormOptions,
  getAllServiceCategories,
  getAllCitiesOptions
} from './resource.controller.js';

const router = express.Router();

router.get('/venue-types', getVenueTypes);
router.get('/venue-features', getVenueFeatures);
router.get('/locations', getLocationOptions);
router.get('/form-options', getAllVenueFormOptions);
router.get('/cities', getAllCitiesOptions);

router.get('/service-categories' , getAllServiceCategories);


export default router;