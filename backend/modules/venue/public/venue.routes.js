import express from 'express';

import { getVenues, getVenue } from './venue.controller.js';

const router = express.Router();


router.get('/' , getVenues);
router.get('/:venueId' , getVenue);

export default router;