import express from 'express';
import { getAllUsers, getUSer, updateUser, deleteUser } from './controllers.js';

const router = express.Router();

router.get("/all", getAllUsers);
router.route("/:userId")
.get(getUSer)
.put(updateUser)
.delete(deleteUser);

export default router;