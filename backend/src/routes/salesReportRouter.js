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
ReportRouter.get("/salesCount", verifyToken, permit('admin'), getSalesCountByDateRange);
ReportRouter.get("/productsTop", verifyToken, permit('admin'), getTopProductsByDateRange);
ReportRouter.get("/averageSales", verifyToken, permit('admin'), getAverageSaleByDateRange);
ReportRouter.get("/salesCategory", verifyToken, permit('admin'), getSalesByCategoryByDateRange);
ReportRouter.get("/salesUser", verifyToken, permit('admin'), getSalesByUserByDateRange);

export default ReportRouter;