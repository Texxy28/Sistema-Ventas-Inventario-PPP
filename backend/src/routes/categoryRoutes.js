import express from 'express';
import { addCategory, deleteCategory, getAllCategories, getAllCategoriesWithProductCount, updateCategory } from '../controllers/categoriesController.js';

const CategoryRouter = express.Router();

CategoryRouter.get("/", getAllCategories)
CategoryRouter.get("/productCount", getAllCategoriesWithProductCount)
CategoryRouter.post("/", addCategory)
CategoryRouter.put("/:id", updateCategory)
CategoryRouter.delete("/:id", deleteCategory)

export default CategoryRouter;