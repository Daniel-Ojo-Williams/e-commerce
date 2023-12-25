import express from 'express';
import { createUser, deleteUser, getAllUsers, getUSer, updateUser } from './controller.js';

const router = express.Router();

router.post('/createUser', createUser);
router.route('/:userId').get(getUSer).put(updateUser).delete(deleteUser);
router.get('/', getAllUsers);

export default router;