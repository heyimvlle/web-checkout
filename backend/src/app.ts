import cors from 'cors';
import express from 'express';
import { errorHandler } from './middleware/error-handler.js';
import { ordersRouter } from './routes/orders.routes.js';
import { productsRouter } from './routes/products.routes.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/products', productsRouter);
  app.use('/orders', ordersRouter);

  app.use(errorHandler);

  return app;
}
