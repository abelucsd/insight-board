import { products, Product, IProduct } from "../models/product";
import { Request, Response, NextFunction } from "express";
import { createLogger } from "../utils/logger";

const logger = createLogger('product.service');

export const productService = {
  getProducts: async(): Promise<IProduct[]>  => {
    try {
      logger.info(`[getProducts] Returning ${products.length} product(s).`);
      return await Product.find({});
    } catch (error) {      
      logger.error(`[getProducts] Error fetching products: ${(error as Error).message}`);
      throw new Error("Failed to fetch products");
    }
  },
};