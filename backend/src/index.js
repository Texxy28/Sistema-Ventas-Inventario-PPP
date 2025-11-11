import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ProductRouter from './routes/productRoutes.js';
import CategoryRouter from './routes/categoryRoutes.js';
import SaleRouter from './routes/saleRoutes.js';
import VoucherRouter from './routes/voucherRoutes.js';
import AuthRouter from './routes/authRoutes.js';
import UserRouter from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import ReportRouter from './routes/salesReportRouter.js';
import InventoryReportRouter from './routes/inventoryReportRouter.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api/product", ProductRouter)
app.use("/api/category", CategoryRouter)
app.use("/api/sale", SaleRouter)
app.use("/api/voucher", VoucherRouter)
app.use("/api/auth", AuthRouter)
app.use("/api/user", UserRouter)
app.use("/api/report", ReportRouter)
app.use("/api/inventoryReport", InventoryReportRouter)

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});