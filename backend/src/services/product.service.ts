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
      throw err;
    }
  },
  getProducts: async(search: string, page: number, limit: number): Promise<{data: IProduct[], total: number}>  => {
    try {
      logger.info(`[getProducts] Returning ${products.length} product(s).`);      

      const query = search
        ? { name: {$regex: search, $options: 'i'}}
        : {};              
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        Product.find(query).skip(skip).limit(limit),
        Product.countDocuments(query),
      ]);
      
      return { data, total };
    } catch (error) {
      const err = new CustomError('Failed to fetch products', 500);
      throw err;
    }
  },
  getProductById: async (id: string): Promise<IProduct | null> => {
    try {
      logger.info(`[getProductById] Fetching product with ID: ${id}`);
      return await Product.findById(id);
    } catch (error) {
      const err = new CustomError('Failed to fetch product by ID', 404);
      throw err;
    }
  },
  updateProduct: async (id: string, productData: Partial<CreateProductInput>): Promise<IProduct | null> => {
    try {
      logger.info(`[updateProduct] Updating product with ID: ${id}`);
      return await Product.findByIdAndUpdate(id, productData, { new: true });
    } catch (error) {
      const err = new CustomError('Failed to update product', 404);      
      throw err;
    }
  },
  deleteProduct: async (id: string): Promise<IProduct | null> => {
    try {
      logger.info(`[deleteProduct] Deleting product with ID: ${id}`);
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      const err = new CustomError('Failed to delete product', 404);      
      throw err;
    }
  }
};