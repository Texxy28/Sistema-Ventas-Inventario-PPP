import express from 'express';
import { addCategory, deleteCategory, getAllCategories, getAllCategoriesWithProductCount, updateCategory } from '../controllers/categoriesController.js';
import { verifyToken, permit } from '../middleware/verifyToken.js';

const CategoryRouter = express.Router();

CategoryRouter.get("/", verifyToken, permit('admin', 'vendedor'), getAllCategories)
CategoryRouter.get("/productCount", verifyToken, permit('admin', 'vendedor'), getAllCategoriesWithProductCount)
CategoryRouter.post("/", verifyToken, permit('admin'), addCategory)
CategoryRouter.put("/:id", verifyToken, permit('admin'), updateCategory)
CategoryRouter.delete("/:id", verifyToken, permit('admin'), deleteCategory)

export default CategoryRouter;