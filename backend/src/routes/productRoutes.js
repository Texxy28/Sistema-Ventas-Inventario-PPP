import express from 'express';
import { addProduct, deleteProduct, getAllProducts, getProductByCategory, getProductBySearchQuery, getProductBySearchQueryAndCategory, updateProduct } from '../controllers/productController.js';
import { permit, verifyToken } from '../middleware/verifyToken.js';

const ProductRouter = express.Router();

ProductRouter.get("/", getAllProducts);
ProductRouter.get("/category", getProductByCategory);
ProductRouter.post("/", verifyToken, permit('admin'), addProduct);
ProductRouter.put("/:id", verifyToken, permit('admin'), updateProduct);
ProductRouter.delete("/:id", verifyToken, permit('admin'), deleteProduct);
ProductRouter.get("/search/category", verifyToken, permit('admin', 'vendedor'), getProductBySearchQueryAndCategory);
ProductRouter.get("/search", verifyToken, permit('admin', 'vendedor'), getProductBySearchQuery);

export default ProductRouter;