import express from 'express';
import {productRouter} from './routes/product.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api/products', productRouter);

app.use(errorHandler);

export default app;