import express from 'express';
import { addProduct, deleteProduct, getAllProducts, updateProduct } from '../controllers/productController.js';
import { permit, verifyToken } from '../middleware/verifyToken.js';

const ProductRouter = express.Router();

ProductRouter.get("/", getAllProducts);
ProductRouter.post("/", verifyToken, permit('admin'), addProduct);
ProductRouter.put("/:id", verifyToken, permit('admin'), updateProduct);
ProductRouter.delete("/:id", verifyToken, permit('admin'), deleteProduct);

export default ProductRouter;