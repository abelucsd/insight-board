import { Request, Response, NextFunction } from 'express';
import { products, Product } from '../models/product';
import { productService } from '../services/product.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('product.controller');

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('[getProducts] Received request to get all products.');

    const response = await productService.getProducts();

    logger.info(`[getProducts] Successfully fetched ${response.length} product(s).`);
    res.status(200).json(response);    
  } catch (error) {    
    logger.error(`[getProducts] Failed to get products: ${(error as Error).message}`);
    next(error);
  }
};