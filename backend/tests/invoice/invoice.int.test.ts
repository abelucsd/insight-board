import { Request } from 'express';
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { jest } from '@jest/globals';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { IInvoice, Invoice } from '../../src/models/invoice';
import { invoiceService } from '../../src/services/invoice.service';

describe('Invoice Integration', () => {
  let mongoServer: MongoMemoryServer;

  const invoices = [
    {      
      id: 'inv-01',
      customer: "Foo 1", 
      itemName: "Bar 2",
      itemNumber: 'prod-01',
      price: 5,
      date: new Date().toDateString(),
      quantity: 10,
      revenue: 50,
      cost: 10,
      profit: 40,
      location: 'USA',
    },
    {      
      id: 'inv-02',
      customer: "Foo 2", 
      itemName: "Bar 2",
      itemNumber: 'prod-02',
      price: 10,
      date: new Date().toDateString(),
      quantity: 20,
      revenue: 200,
      cost: 40,
      profit: 160,
      location: 'USA',
    }
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

      for(const [field, value] of Object.entries(invoices[0])){
        expect(result[field as keyof IInvoice]).toBe(value);
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
      const cleanedresult = data.map((item) => ({
        id: item.id,
        customer: item.customer,
        itemName: item.itemName,
        itemNumber: item.itemNumber,
        price: item.price,
        date: item.date,
        quantity: item.quantity,
        revenue: item.revenue,
        cost: item.cost,
        profit: item.profit,
        location : item.location,
      }));

      expect(cleanedresult).toEqual(invoices);
    });
  });

  describe('get invoice by id', () => {
    it('should return an invoice by ID', async () => {
      const newInvoice = await Invoice.create(invoices[0]);
      const result = await invoiceService.getInvoiceById(newInvoice._id);
      for(const [field, value] of Object.entries(invoices[0])) {
        expect(result![field as keyof IInvoice]).toBe(value);
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
      for(const [field, value] of Object.entries(invoices[0])) {
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
