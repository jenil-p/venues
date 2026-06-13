import express from 'express';
import { getVenueAvailability } from './availability.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/:venueId/availability', getVenueAvailability);

export default router;