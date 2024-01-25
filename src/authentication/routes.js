import express from 'express';
import { signUp, logIn, logOut, refreshToken } from './controller.js';


const router = express.Router();

router.post('/signup', signUp);

router.post('/login', logIn);
router.get('/logout', logOut);
router.get('/refresh', refreshToken);


export default router;