import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ProductRouter from './routes/productRoutes.js';
import CategoryRouter from './routes/categoryRoutes.js';
import SaleRouter from './routes/saleRoutes.js';
import VoucherRouter from './routes/voucherRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/product", ProductRouter)
app.use("/api/category", CategoryRouter)
app.use("/api/sale", SaleRouter)
app.use("/api/voucher", VoucherRouter)

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});