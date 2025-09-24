import express from 'express';
import { getAllCategories } from '../controllers/categoriesController.js';

const CategoryRouter = express.Router();

CategoryRouter.get("/", getAllCategories)

export default CategoryRouter;