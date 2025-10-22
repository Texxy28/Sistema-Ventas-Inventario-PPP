import express from 'express';
import { deleteUser, getUser, getUsers, updateUser } from '../controllers/userController.js';
import { permit, verifyToken } from '../middleware/verifyToken.js';

const UserRouter = express.Router()

UserRouter.get("/", verifyToken, permit('admin'), getUsers);
UserRouter.get("/:id", verifyToken, permit('admin'), getUser);
UserRouter.put("/:id", verifyToken, permit('admin'), updateUser);
UserRouter.delete("/:id", verifyToken, permit('admin'), deleteUser);

export default UserRouter;