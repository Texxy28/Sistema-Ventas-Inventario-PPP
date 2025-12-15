import express from 'express';
import { addSale, getSalesList } from '../controllers/salesController.js';
import { permit, verifyToken } from '../middleware/verifyToken.js';

const SaleRouter = express.Router();

SaleRouter.get("/", verifyToken, permit('admin', 'vendedor'), getSalesList);
SaleRouter.post("/", verifyToken, permit('admin', 'vendedor'), addSale);

export default SaleRouter;