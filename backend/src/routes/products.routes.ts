import { Router } from 'express';
import { listCategories, listProducts } from '../services/product.service.js';

export const productsRouter = Router();

productsRouter.get('/', async (req, res, next) => {
  try {
    const category =
      typeof req.query.category === 'string' && req.query.category.trim() !== ''
        ? req.query.category.trim()
        : undefined;

    const products = await listProducts(category);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get('/categories', async (_req, res, next) => {
  try {
    const categories = await listCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});
