import express from 'express';
import cors from 'cors';
import {productRouter} from './routes/product.routes';
import { workerRouter } from './routes/worker.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// TODO: update this in production.
app.use(cors());

// Routes
app.use('/api/products', productRouter);

app.use('/api/worker', workerRouter);

app.use(errorHandler);

export default app;