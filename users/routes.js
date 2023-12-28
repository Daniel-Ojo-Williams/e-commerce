import express from 'express';
import { getAllUsers, getUSer, updateUser, deleteUser } from './controllers.js';

const router = express.Router();

router.route("/:userId").get(getUSer).put(updateUser).delete(deleteUser);
router.get("/all", getAllUsers);

export default router;