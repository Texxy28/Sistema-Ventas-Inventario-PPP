import express from 'express';
import { getAllSuppliers } from '../controllers/suppliersContoller.js';
import { permit, verifyToken } from '../middleware/verifyToken.js';

const SupplierRouter = express.Router();

SupplierRouter.get("/", verifyToken, permit('admin', 'vendedor'), getAllSuppliers);

export default SupplierRouter;