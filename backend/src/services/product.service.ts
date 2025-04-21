import { products, Product, IProduct, CreateProductInput } from "../models/product";
import { Request, Response, NextFunction } from "express";
import { createLogger } from "../utils/logger";
import { createProduct } from "../controllers/product.controller";
import { CustomError } from "../errors/CustomError";

const logger = createLogger('product.service');



export const productService = {
  createProduct: async (productData: CreateProductInput): Promise<IProduct> => {
    try {
      logger.info(`[createProduct] Creating product with name: ${productData.name}`);
      const newProduct = await Product.create(productData);      
      logger.info(`[createProduct] Product created with ID: ${newProduct._id}`);
      return newProduct;
    } catch (error) {
      const err = new CustomError('Failed to create product', 400);      
      logger.error(`[createProduct] Error creating product: ${err.message}`);
      throw err;
    }
  },
  getProducts: async(): Promise<IProduct[]>  => {
    try {
      logger.info(`[getProducts] Returning ${products.length} product(s).`);
      return await Product.find({});
    } catch (error) {
      const err = new CustomError('Failed to fetch products', 500);
      logger.error(`[getProducts] Error fetching products: ${err.message}`);
      throw err;
    }
  },
};