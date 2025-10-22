import express from 'express';
import { createDoc, getAllVouchers, getVoucherById } from '../controllers/voucherController.js';
import { permit, verifyToken } from '../middleware/verifyToken.js';

const VoucherRouter = express.Router();

VoucherRouter.get("/", verifyToken, permit('admin', 'vendedor'), getAllVouchers);
VoucherRouter.get("/:id", verifyToken, permit('admin', 'vendedor'), getVoucherById);
VoucherRouter.get("/pdf/:id", verifyToken, permit('admin', 'vendedor'), createDoc);

export default VoucherRouter;