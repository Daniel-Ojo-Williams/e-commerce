import express from 'express';
import { signUp, logIn, logOut } from './controller.js';


const router = express.Router();

router.post('/signup', signUp);

router.post('/login', logIn);
router.get('/logout', logOut);


export default router;