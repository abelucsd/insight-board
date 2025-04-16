import express from 'express';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { Product } from '../src/models/product';
import { productRouter } from '../src/routes/product.routes';

const app = express();
app.use(express.json());
app.use('/api/products', productRouter);

describe('Products API', () => {  
  let mongoServer: MongoMemoryServer;

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

  beforeEach(async () => {
    await Product.deleteMany({});
  })
  

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

});