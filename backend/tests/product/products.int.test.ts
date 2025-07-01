import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { jest } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { Product } from '../../src/models/product';
import { productService } from '../../src/services/product.service';


describe('Products Integration', () => {
  let mongoServer: MongoMemoryServer;

  const products = [
    { id: 'prod-01', name: 'Product 1', category: 'Electronics', price: 10, salePrice: 10, cost: 4},
    { id: 'prod-02', name: 'Product 2', category: 'Electronics', price: 20, salePrice: 20, cost: 8},
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
      const newProduct = { id: 'prod-01', name: 'Product 1', category: 'Electronics', price: 10, salePrice: 10, cost: 4};
      
      const result = await productService.createProduct(newProduct);
      expect(result.name).toBe(newProduct.name);
      expect(result.price).toBe(newProduct.price);
    });

    it('should throw an error when creating a product fails', async () => {
      const newProduct = { id: 'prod-01', name: '', category: 'Electronics', price: 10, salePrice: 10, cost: 4};
      await expect(productService.createProduct(newProduct)).rejects.toThrow('Failed to create product');
    });
  });
  

  describe('get products', () => {
    it('should return an empty array when no products exist', async () => {
      const result = await productService.getProducts('', 1, 10);
      expect(result).toEqual({data: [], total: 0});
    });

    it('should return a list of products', async () => {

      for (const product of products) {
        await Product.create(product);
      }
      
      const {data, total} = await productService.getProducts('', 1, 100);

      const cleanResult = data.map((item) => ({
        id: item.id,        
        name: item.name,
        category: item.category,
        price: item.price,
        salePrice: item.salePrice,
        cost: item.cost,
      }));

      expect(cleanResult).toEqual(products);
    });
  });

  describe('get product by id', () => {
    it('should return a product by ID', async () => {
      const newProduct = await Product.create({ id: 'prod-01', name: 'Product 1', category: 'Electronics', price: 10, salePrice: 10, cost: 4});
      
      const result = await productService.getProductById(newProduct._id);
      expect(result!.name).toBe(newProduct.name);
      expect(result!.price).toBe(newProduct.price);
    });

    it('should throw an error when product not found', async () => {
      await expect(productService.getProductById('invalid-id')).rejects.toThrow('Failed to fetch product by ID');
    });
  });


  describe('update product', () => {
    it('should update a product', async () => {
      const newProduct = await Product.create({ id: 'prod-01', name: 'Product 1', category: 'Electronics', price: 10, salePrice: 10, cost: 4},);
      const updatedProduct = await productService.updateProduct(newProduct._id, { price: 60 });
      expect(updatedProduct!.price).toBe(60);
    });

    it('should throw an error when updating a product fails', async () => {
      await expect(productService.updateProduct('invalid-id', { price: 60 })).rejects.toThrow('Failed to update product');
    });
  });


  describe('delete product', () => {
    it('should delete a product', async () => {
      const newProduct = await Product.create({ id: 'prod-01', name: 'Product 1', category: 'Electronics', price: 10, salePrice: 10, cost: 4},);
      const deletedProduct = await productService.deleteProduct(newProduct._id);
      expect(deletedProduct!.name).toBe(newProduct.name);
    });

    it('should throw an error when deleting a product fails', async () => {
      await expect(productService.deleteProduct('invalid-id')).rejects.toThrow('Failed to delete product');
    });
  });
});