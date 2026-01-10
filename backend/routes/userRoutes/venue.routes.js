import express from 'express';

import { getVenues } from '../../controllers/userControllers/venue.controller.js';

const router = express.Router();


router.get('/' , getVenues);

export default router;