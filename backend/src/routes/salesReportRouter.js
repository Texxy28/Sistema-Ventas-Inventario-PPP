import express from "express";
import {
  getAverageSaleByDateRange,
  getSalesByCategoryByDateRange,
  getSalesByDateRange,
  getSalesByUserByDateRange,
  getSalesCountByDateRange,
  getTopProductsByDateRange,
} from "../controllers/salesReportController.js";
import { permit, verifyToken } from "../middleware/verifyToken.js";

const ReportRouter = express.Router();

ReportRouter.get("/sales", verifyToken, permit('admin'), getSalesByDateRange);
ReportRouter.get("/sales/count", verifyToken, permit('admin'), getSalesCountByDateRange);
ReportRouter.get("/products/top", verifyToken, permit('admin'), getTopProductsByDateRange);
ReportRouter.get("/average/sales", verifyToken, permit('admin'), getAverageSaleByDateRange);
ReportRouter.get("/sales/category", verifyToken, permit('admin'), getSalesByCategoryByDateRange);
ReportRouter.get("/sales/user", verifyToken, permit('admin'), getSalesByUserByDateRange);

export default ReportRouter;