import express from 'express';
import cors from 'cors';

import { swaggerDocument } from './config/swagger';
import {productRouter} from './routes/product.routes';
import { workerRouter } from './routes/worker.routes';
import { errorHandler } from './middlewares/errorHandler';
import { limiter } from './config/rateLimiter';
import { invoiceRouter } from './routes/invoice.routes';
import { invoiceAnalyticsRouter } from './routes/invoiceAnalytics.routes';

const app = express();

app.use(express.json());

// swagger docs
const swaggerUi = require('swagger-ui-express');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// TODO: update this in production.
app.use(cors({
  origin: ['https://ecommerce-api-dashboard.vercel.app', 'localhost:3000'],
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(limiter);

// Routes
app.use('/api/products', productRouter);
app.use('/api/invoice', invoiceRouter);
app.use('/api/invoice/analytics', invoiceAnalyticsRouter);

app.use('/api/worker', workerRouter);

app.use(errorHandler);

export default app;