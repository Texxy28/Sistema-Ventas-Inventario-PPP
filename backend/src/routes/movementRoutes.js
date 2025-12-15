import express from 'express';
import { permit, verifyToken } from '../middleware/verifyToken.js';
import { getMovementList } from '../controllers/movementsController.js';

const MovementRouter = express.Router();

MovementRouter.get("/", verifyToken, permit('admin'), getMovementList);

export default MovementRouter;
