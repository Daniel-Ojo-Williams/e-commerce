import express from 'express';
import { createCart } from './controllers.js';

const router = express.Router();

router.route('/').get(createCart);

export default router;