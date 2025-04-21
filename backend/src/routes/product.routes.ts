import express, { Router } from 'express';
import {  
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';

export const productRouter = express.Router();

productRouter.get('/', getProducts);
productRouter.post('/', createProduct);
productRouter.get('/:id', getProductById);
productRouter.put('/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);
