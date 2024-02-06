import express from 'express';
import { resetPassword, sendOTP, verifyOTP } from './controller.js';

const router = express.Router();

router.route('/sendOTP').post(sendOTP);
router.route('/verifyOTP').post(verifyOTP);
router.route('/resetPassword').post(resetPassword);

export default router;