import { Request, Response } from 'express';
import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

import { Invoice, IInvoice } from '../src/models/invoice';
import { createInvoice, getInvoiceById, getInvoices } from '../src/controllers/invoice.controller';
import { invoiceService } from '../src/services/invoice.service';
import { CustomError } from '../src/errors/CustomError';

describe("Invoice CRUD unit test", () => {
  let req: Request;
  let res: Response;
  let next: jest.Mock;

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

  beforeEach(() => {

    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    next = jest.fn();
  });


  describe('Create Invoice', () => {
    it('should create a invoice and return it', async() => {
      const newInvoice = invoices[0];
      const createdInvoice = { _id: '1', ...newInvoice };

      jest.spyOn(invoiceService, 'createInvoice').mockResolvedValue(createdInvoice as IInvoice);
      req.body = newInvoice; // Mock request body - uses CreateInvoiceInput
      
      await createInvoice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdInvoice);
    });

    it('should call next with an error if service throws', async() => {
      const mockError = new Error('Database failure');
      req.body = invoices[0];

      jest.spyOn(invoiceService, 'createInvoice').mockRejectedValue(mockError);

      await createInvoice(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('Get Invoice', () => {
    it("Get empty invoice list", async () => {      
      const mockInvoices: IInvoice[] = [];
      jest.spyOn(invoiceService, 'getInvoices').mockResolvedValue(mockInvoices);

      await getInvoices(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);    
      expect(res.json).toHaveBeenCalledWith(mockInvoices);
    });

    it("Get created invoice list", async () => {    
      const mockInvoices: IInvoice[] = [
        {
          _id: '1',
          customer: "Foo", 
          itemName: "Bar",
          itemNumber: 123,
          price: 5,
          date: new Date().toDateString(),
          quantity: 10,
          revenue: 50,
          totalCost: 10,
          profit: 40,
          location: 'USA',
        }
      ];

      jest.spyOn(invoiceService, 'getInvoices').mockResolvedValue(mockInvoices);

      await getInvoices(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockInvoices);
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new CustomError('Database failure', 500);
      jest.spyOn(invoiceService, 'getInvoices').mockRejectedValue(mockError);

      await getInvoices(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('Get Invoice by ID', () => {
    it('should return an invoice by ID', async () => {
      const invoiceId = '1';
      const invoice = { _id: invoiceId, ...invoices[0] };

      jest.spyOn(invoiceService, 'getInvoiceById').mockResolvedValue(invoice);
      req.params = { id: invoiceId };
      await getInvoiceById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toBeCalledWith(invoice);
    });

    it('should return 404 if invoice not found', async () => {
      const invoiceId = '1';
      jest.spyOn(invoiceService, 'getInvoiceById').mockResolvedValue(null);
      req.params = { id: invoiceId };

      await getInvoiceById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invoice not found' });
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      req.params = { id: '1' };
      jest.spyOn(invoiceService, 'getInvoiceById').mockRejectedValue(mockError);

      await getInvoiceById(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
  
  


});