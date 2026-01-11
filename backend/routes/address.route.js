import express from 'express';

const router = express.Router();

import { getCity } from '../controllers/address.controller.js';

router.get('/city' , getCity);

export default router;