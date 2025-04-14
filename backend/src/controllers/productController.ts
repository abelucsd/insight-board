import { Request, Response, NextFunction } from 'express';
import { products, Product } from '../models/product';

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(products);
  } catch (error) {
    next(error);
  }
};

