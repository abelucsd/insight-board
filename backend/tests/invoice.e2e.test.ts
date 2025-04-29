import express from 'express';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { IInvoice, Invoice } from '../src/models/invoice';
import { invoiceRouter } from '../src/routes/invoice.routes';

const app = express();
app.use(express.json());
app.use('/api/invoice', invoiceRouter);

describe('Invoice API', () => {
  let mongoServer: MongoMemoryServer;
  let server: any;

  const invoices = [
    {      
      customer: "Foo 1", 
      itemName: "Bar 2",
      itemNumber: 123,
      price: 5,
      date: new Date().toDateString(),
      quantity: 10,
      revenue: 50,
      totalCost: 10,
      profit: 40,
      location: 'USA',
    },
    {      
      customer: "Foo 2", 
      itemName: "Bar 2",
      itemNumber: 123,
      price: 10,
      date: new Date().toDateString(),
      quantity: 20,
      revenue: 200,
      totalCost: 40,
      profit: 160,
      location: 'USA',
    }
  ];

  // setup and teardown
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    server = app.listen(3010);
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();    
  });

  beforeEach(async () => {
    await Invoice.deleteMany({});
  });


  describe('POST /invoice', () => {
    it('should create a new invoice', async () => {
      const newInvoice = invoices[0];
      const response = await request(app).post('/api/invoice').send(newInvoice);
      expect(response.status).toBe(201);
      for(const [field, value] of Object.entries(invoices[0])) {
        expect(response.body[field]).toBe(value);
      }
    });

    it('should return 400 if invoice data is invalid', async () => {
      const invalidInvoice = { ...invoices[0] };
      invalidInvoice.customer = '';
      const response = await request(app).post('/api/invoice').send(invalidInvoice);
      expect(response.status).toBe(400);
    });

  });

  describe('GET /invoice', () => {
    it('should return an empty array of documents when no invoices exist', 
      async () => {
        const response = await request(app).get('/api/invoice');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should return an array of created invoice documents', async () => {
      for(const invoice of invoices) {
        await Invoice.create(invoice);
      }
      const response = await request(app).get('/api/invoice');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(invoices);
    });
  });

  describe('GET /invoice/:id', () => {
    it('should return an invoice by ID', async () => {
      const newInvoice = await Invoice.create(invoices[0]);
      const response = await request(app).get(`/api/invoice/${newInvoice._id}`);
      expect(response.status).toBe(200);
      
      for(const [field, value] of Object.entries(invoices[0])) {
        expect(response.body[field as keyof IInvoice]).toBe(value);
      }
    });

    it('should return 404 if invoice not found', async () => {
      const response = await request(app).get('/api/products/invalid-id');
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /invoice/:id', () => {
    it('should update an invoice', async () => {
      const newInvoice = await Invoice.create(invoices[0]);
      const updatedInvoice = { ...invoices[0] };
      updatedInvoice.customer = "Updated Customer Name";
      const response = await request(app).put(`/api/invoice/${newInvoice._id}`)
        .send(updatedInvoice);

      expect(response.status).toBe(200);
      expect(response.body.customer).toBe(updatedInvoice.customer);
    });
  });
});