import { Router } from 'express';
import {
  listCategories,
  listProducts,
  getBestsellers,
  getRecommendations,
} from '../services/product.service.js';

export const productsRouter = Router();

productsRouter.get('/bestsellers', async (_req, res, next) => {
  try {
    const products = await getBestsellers();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get('/:id/recommendations', async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }

    const recommendation = await getRecommendations(productId);
    
    if (!recommendation) {
      res.status(404).json({ message: 'No recommendations found' });
      return;
    }

    res.json(recommendation);
  } catch (error) {
    next(error);
  }
});

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
