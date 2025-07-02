import { Request } from 'express';
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { jest } from '@jest/globals';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';

import { IInvoice, IInvoiceItem, Invoice } from '../../src/models/invoice';
import { invoiceService } from '../../src/services/invoice.service';

describe('Invoice Integration', () => {
  let mongoServer: MongoMemoryServer;

  const invoices = [
    {
      id: 'inv-01',
      customer: 'Foo Bar',
      date: new Date().toDateString(),
      location: 'USA',
      items: [{
        id: 'prod-01',
        name: 'Item 1',        
        salePrice: 10,
        quantity: 2,
        revenue: 20,
        cost: 8,
        profit: 12,
      }],
      totalRevenue: 20,
      totalCost: 8,
      totalProfit: 12,
    },    
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
    await Invoice.deleteMany({});
  });


  describe('create invoice', () => {
    it('should create a new invoice', async () => {
      const newInvoice = invoices[0];
      const result = await invoiceService.createInvoice(newInvoice);
      
      const skipFields = new Set(['_id', '__v', 'date', 'items']);

      for(const [field, value] of Object.entries(invoices[0])){
        if (skipFields.has(field)) continue;
        expect(result[field as keyof IInvoice]).toEqual(value);
      }
      for (const [field, value] of Object.entries(invoices[0].items[0])) {
        expect(result!.items[0][field as keyof IInvoiceItem]).toEqual(value);
      }      
    });

    it('should throw an error when creating an invoice fails', async () => {
      const newInvoice = { ...invoices[0] };
      newInvoice.customer = '';
      await expect(invoiceService.createInvoice(newInvoice))
        .rejects
        .toThrow('Failed to create the invoice');
    });
  });

  describe('get invoices', () => {
    it('get empty list of invoice documents', async () => {      
      const {data, total} = await invoiceService.getInvoices('', 1, 10);
      expect(data).toEqual([]);
    });

    it('get created invoice documents', async () => {

      for(const invoice of invoices) {        
        await Invoice.create(invoice);
      }

      const {data, total} = await invoiceService.getInvoices('', 1, 10);
      // cleanup mongoose added variables
      const cleanedResult = data.map((invoice) => ({
        id: invoice.id,        
        customer: invoice.customer,
        date: invoice.date,
        location: invoice.location,
        items: invoice.items,
        totalRevenue: invoice.totalRevenue,
        totalCost: invoice.totalCost,
        totalProfit: invoice.totalProfit,
      }));

      const skipFields = new Set(['_id', '__v', 'date', 'items']);      

      for(const [field, value] of Object.entries(invoices[0])){
        if (skipFields.has(field)) continue;
        expect(data[0][field as keyof IInvoice]).toEqual(value);
      }
      
    });
  });

  describe('get invoice by id', () => {
    it('should return an invoice by ID', async () => {
      const newInvoice = await Invoice.create(invoices[0]);
      const result = await invoiceService.getInvoiceById(newInvoice._id);
      const skipFields = new Set(['_id', '__v', 'date', 'items']);

      for(const [field, value] of Object.entries(invoices[0])) {
        if (skipFields.has(field)) continue;
        expect(result![field as keyof IInvoice]).toBe(value);
      }
      
      for(const [field, value] of Object.entries(invoices[0].items[0])) {
        expect(result!.items[0][field as keyof IInvoiceItem ]).toEqual(value);
      }      
    });

    it('should throw an error when invoice not found', async () => {
      await expect(invoiceService.getInvoiceById('invalid-id'))
        .rejects
        .toThrow('Failed to fetch invoice by ID');
    });
  });

  describe('update invoice by id', () => {
    it('should update an invoice', async () => {
      const newInvoice = await Invoice.create(invoices[0]);

      let req = {} as Request;
      req.body = invoices[0];
      const updatedInvoice = await invoiceService.updateInvoiceById(newInvoice._id, req.body);
      
      const skipFields = new Set(['_id', '__v', 'date', 'items']);      
      for(const [field, value] of Object.entries(invoices[0])) {
        if (skipFields.has(field)) continue;
        expect(updatedInvoice![field as keyof IInvoice]).toBe(value);
      }
    });

    it('should throw an error when updating an invoice fails', async () => {
      let req = {} as Request;
      req.body = invoices[0];
      await expect(invoiceService.updateInvoiceById('invalid-id', req.body))
        .rejects
        .toThrow('Failed to update invoice');
    });
  });

  describe('delete product', () => {
    it('should delete an invoice', async () => {
      const newInvoice = await Invoice.create(invoices[0]);
      const deletedInvoice = await invoiceService.deleteInvoiceById(newInvoice._id);      
      expect(deletedInvoice!._id.toString()).toBe(newInvoice._id.toString());
    });

    it('should throw an error when deleting a product fails', async () => {
      await expect(invoiceService.deleteInvoiceById('invalid-id'))
        .rejects
        .toThrow('Failed to delete invoice');
    });
  });
});
