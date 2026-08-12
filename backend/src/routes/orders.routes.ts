import { Router } from 'express';
import { createOrder } from '../services/order.service.js';

export const ordersRouter = Router();

ordersRouter.post('/', async (req, res, next) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});
