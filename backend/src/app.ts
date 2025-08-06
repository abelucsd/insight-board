import express from 'express';
import cors from 'cors';

import { swaggerDocument } from './config/swagger';
import {productRouter} from './routes/product.routes';
import { workerRouter } from './routes/worker.routes';
import { errorHandler } from './middlewares/errorHandler';
import { limiter } from './config/rateLimiter';
import { invoiceRouter } from './routes/invoice.routes';
import { invoiceAnalyticsRouter } from './routes/invoiceAnalytics.routes';
import { visitAnalyticsRouter } from './routes/visitAnalytics.routes';
import { analyticsRouter } from './routes/analytics.routes';
import { customerRouter } from './routes/customer.route';
import { startAnalyticsWorker, stopAnalyticsWorker } from './workers/analytics/invoice/analyticsWorker';
import { setupCronJobs } from './utils/cronjob';
import * as customerWorker from './workers/analytics/customer/worker';


const app = express();

app.use(express.json());

// swagger docs
const swaggerUi = require('swagger-ui-express');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// TODO: update this in production.
// app.use(cors({
//   origin: [
//     'https://ecommerce-api-dashboard.vercel.app', 
//     'https://insight-dboard.vercel.app',
//     'https://staging-insight-dboard.vercel.app',
//     'localhost:3000'],
//   methods: ['GET'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

app.use(cors());

app.use(limiter);

// Worker
startAnalyticsWorker();
customerWorker.startWorker();

// Routes
app.use('/api/products', productRouter);
app.use('/api/invoice', invoiceRouter);
app.use('/api/invoice/analytics', invoiceAnalyticsRouter);
app.use('/api/visit/analytics', visitAnalyticsRouter);
app.use('/api/customer', customerRouter);
app.use('/api/analytics', analyticsRouter);

app.use('/api/worker', workerRouter);

app.use(errorHandler);

// Cronjobs
setupCronJobs();

// Shutdown Worker
process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing worker...');
  await stopAnalyticsWorker();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing worker...');
  await stopAnalyticsWorker();
  process.exit(0);
});


process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing worker...');
  await customerWorker.stopAnalyticsWorker();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing worker...');
  await customerWorker.stopAnalyticsWorker();
  process.exit(0);
});

export default app;