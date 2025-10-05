import express from 'express';
import { addSale, getAllSales } from '../controllers/salesController.js';

const SaleRouter = express.Router();

SaleRouter.get("/", getAllSales);
SaleRouter.post("/", addSale);


export default SaleRouter;