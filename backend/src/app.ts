import express from 'express';
import {productRouter} from './routes/product.routes';
import { workerRouter } from './routes/worker.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api/products', productRouter);

app.use('api/worker/load-file', workerRouter);

app.use(errorHandler);

export default app;