import express from 'express';
import { addProduct, deleteProduct, getAllProducts, updateProduct } from '../controllers/productController.js';

const ProductRouter = express.Router();

ProductRouter.get("/", getAllProducts);
ProductRouter.post("/", addProduct);
ProductRouter.put("/:id", updateProduct);
ProductRouter.delete("/:id", deleteProduct);

export default ProductRouter;