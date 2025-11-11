import express from "express";
import { permit, verifyToken } from "../middleware/verifyToken.js";
import { getBottomProductsByDateRange, getInventoryTotalValue, getProductsLowStockByDateRange, getProductsSoldByCategoryByDateRange, getProductWithNoMovementByDateRange } from "../controllers/inventoryReportController.js";

const InventoryReportRouter = express.Router();

InventoryReportRouter.get("/products/low/stock", verifyToken, permit('admin'), getProductsLowStockByDateRange);
InventoryReportRouter.get("/products/bottom", verifyToken, permit('admin'), getBottomProductsByDateRange);
InventoryReportRouter.get("/products/no/movement", verifyToken, permit('admin'), getProductWithNoMovementByDateRange);
InventoryReportRouter.get("/inventory/value", verifyToken, permit('admin'), getInventoryTotalValue);
InventoryReportRouter.get("/products/sold/category", verifyToken, permit('admin'), getProductsSoldByCategoryByDateRange);

export default InventoryReportRouter;