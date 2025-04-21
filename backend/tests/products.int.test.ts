import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { jest } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { Product } from '../src/models/product';
import { productService } from '../src/services/product.service';


describe('Products Integration', () => {
  let mongoServer: MongoMemoryServer;

  const products = [
    { name: 'Product 1', price: 10 },
    { name: 'Product 2', price: 20 },
  ];  

  // setup and teardown
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Product.deleteMany({});
  });


  describe('create product', () => {
    it('should create a new product', async () => {
      const newProduct = { name: 'Product 3', price: 30 };
      const result = await productService.createProduct(newProduct);
      expect(result.name).toBe(newProduct.name);
      expect(result.price).toBe(newProduct.price);
    });

    it('should throw an error when creating a product fails', async () => {
      const newProduct = { name: '', price: 30 }; // Invalid product name
      await expect(productService.createProduct(newProduct)).rejects.toThrow('Failed to create product');
    });
  });
  

  describe('get products', () => {
    it('should return an empty array when no products exist', async () => {
      const result = await productService.getProducts();
      expect(result).toEqual([]);
    });

    it('should return a list of products', async () => {

      for (const product of products) {
        await Product.create(product);
      }
      
      const result = await productService.getProducts();

      const cleanResult = result.map((item) => ({
        name: item.name,
        price: item.price
      }));

      expect(cleanResult).toEqual(products);
    });
  });  

});