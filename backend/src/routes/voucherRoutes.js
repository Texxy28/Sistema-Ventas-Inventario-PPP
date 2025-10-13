import express from 'express';
import { createDoc, getAllVouchers, getVoucherById } from '../controllers/voucherController.js';

const VoucherRouter = express.Router();

VoucherRouter.get("/", getAllVouchers);
VoucherRouter.get("/:id", getVoucherById);
VoucherRouter.get("/pdf/:id", createDoc);

export default VoucherRouter;