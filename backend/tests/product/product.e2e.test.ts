import express from 'express';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { Product } from '../../src/models/product';
import { productRouter } from '../../src/routes/product.routes';

const app = express();
app.use(express.json());
app.use('/api/products', productRouter);

describe('Products API', () => {  
  let mongoServer: MongoMemoryServer;
  let server: any;

  // setup and teardown
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    server = app.listen(3009);
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();    
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });


  describe('POST /products', () => {
    it('should create a new product', async () => {
      const newProduct = { name: 'Product 1', price: 10 };
      const response = await request(app).post('/api/products').send(newProduct);
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newProduct.name);
      expect(response.body.price).toBe(newProduct.price);

      const productInDb = await Product.findById(response.body._id);
      expect(productInDb).not.toBeNull();
    });

    it('should return 400 if product data is invalid', async () => {
      const invalidProduct = { name: '', price: -10 };
      const response = await request(app).post('/api/products').send(invalidProduct);
      expect(response.status).toBe(400);
    });
  });

  
  describe('Get /products', () => {        
    it('should return an empty array when no products exist', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return products from MongoDB', async () => {
      await Product.create({ name: 'Product 1', price: 10 });
      await Product.create({ name: 'Product 2', price: 20 });
      
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Product 1');
      expect(response.body[1].name).toBe('Product 2');
    });
  });


  describe('Get /products/:id', () => {
    it('should return a product by ID', async () => {
      const newProduct = await Product.create({ name: 'Product 1', price: 10 });
      const response = await request(app).get(`/api/products/${newProduct._id}`);      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(newProduct.name);
    });

    it('should return 404 if product not found', async () => {
      const response = await request(app).get('/api/products/invalid-id');
      expect(response.status).toBe(404);
    });
  });


  describe('PUT /products/:id', () => {
    it('should update a product', async () => {
      const newProduct = await Product.create({ name: 'Product 1', price: 10 });
      const updatedProduct = { name: 'Updated Product', price: 15 };
      const response = await request(app).put(`/api/products/${newProduct._id}`).send(updatedProduct);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedProduct.name);
    });

    it('should return 404 if product not found', async () => {
      const updatedProduct = { name: 'Updated Product', price: 15 };
      const response = await request(app).put('/api/products/invalid-id').send(updatedProduct);
      expect(response.status).toBe(404);
    });
  });


  describe('DELETE /products/:id', () => {
    it('should delete a product', async () => {
      const newProduct = await Product.create({ name: 'Product 1', price: 10 });
      const response = await request(app).delete(`/api/products/${newProduct._id}`);
      expect(response.status).toBe(200);      
    });

    it('should return 404 if product not found', async () => {
      const response = await request(app).delete('/api/products/invalid-id');
      expect(response.status).toBe(404);
    });
  });
});