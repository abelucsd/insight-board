import { Request, Response } from 'express';
import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

import { Invoice, IInvoice } from '../../src/models/invoice';
import { createInvoice, deleteInvoiceById, getInvoiceById, getInvoices, updateInvoiceById } from '../../src/controllers/invoice.controller';
import { invoiceService } from '../../src/services/invoice.service';
import { CustomError } from '../../src/errors/CustomError';

describe("Invoice CRUD unit test", () => {
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  const invoices = [
    {
      id: "inv-01",
      customer: "Foo 1", 
      itemName: "Bar 2",
      itemNumber: 123,
      price: 5,
      date: new Date().toDateString(),
      quantity: 10,
      revenue: 50,
      cost: 10,
      profit: 40,
      location: 'USA',
    },
    {     
      id: "inv-02",
      customer: "Foo 2", 
      itemName: "Bar 2",
      itemNumber: 123,
      price: 10,
      date: new Date().toDateString(),
      quantity: 20,
      revenue: 200,
      cost: 40,
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
      const expectedResponse = {
        message: expect.stringContaining('success'),
        data: createdInvoice
      }

      jest.spyOn(invoiceService, 'createInvoice').mockResolvedValue(createdInvoice as IInvoice);
      req.body = newInvoice; // Mock request body - uses CreateInvoiceInput
      
      await createInvoice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
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
      req = {
        query: { search: '', page: '1', limit: '100'}
      } as any;      

      const mockInvoices = {data: [], total: 0}
      const expectedResponse = {
        message: expect.stringContaining('success'),
        data: mockInvoices
      }

      jest.spyOn(invoiceService, 'getInvoices').mockResolvedValue(mockInvoices);

      await getInvoices(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);    
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    it("Get created invoice list", async () => {    
      req = {
        query: { search: '', page: '1', limit: '100'}
      } as any;
      const mockInvoices: IInvoice[] = [
        {
          _id: '1',
          id: "inv-01",
          customer: "Foo", 
          itemName: "Bar",
          itemNumber: 123,
          price: 5,
          date: new Date().toDateString(),
          quantity: 10,
          revenue: 50,
          cost: 10,
          profit: 40,
          location: 'USA',
        }
      ];

      const mockResult = {data: mockInvoices, total: 1};

      const expectedResponse = {
        message: expect.stringContaining('success'),
        data: mockResult
      }

      jest.spyOn(invoiceService, 'getInvoices').mockResolvedValue(mockResult);

      await getInvoices(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should call next with an error if service throws', async () => {
      req = {
        query: { search: '', page: '1', limit: '100'}
      } as any;

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

      const expectedResponse = {
        message: expect.stringContaining('success'),
        data: invoice
      }

      jest.spyOn(invoiceService, 'getInvoiceById').mockResolvedValue(invoice);
      req.params = { id: invoiceId };
      await getInvoiceById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toBeCalledWith(expectedResponse);
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
  
  describe('Update Invoice by ID', () => {
    it('should update invoice and return it', async () => {
      const invoiceId = '1';
      const updatedInvoice = invoices[0];
      const fetchedInvoice = { _id: invoiceId, ...invoices[0]};

      const expectedResponse = {
        message: expect.stringContaining('success'),
        data: fetchedInvoice
      }

      jest.spyOn(invoiceService, 'updateInvoiceById')
        .mockResolvedValue(fetchedInvoice as IInvoice);
      req.params = { id: invoiceId };
      req.body = updatedInvoice;

      await updateInvoiceById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should return 404 if product not found', async () => {
      const invoiceId = '1';
      jest.spyOn(invoiceService, 'updateInvoiceById').mockResolvedValue(null);
      req.params = { id: invoiceId };
      req.body = invoices[0];

      await updateInvoiceById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invoice not found' });
    });

    it('should call next with an error if service throws', async () => {
      const invoiceId = '1';
      const mockError = new Error('Database Failure');
      req.params = { id: invoiceId };
      req.body = invoices[0];
      jest.spyOn(invoiceService, 'updateInvoiceById').mockRejectedValue(mockError);

      await updateInvoiceById(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('Delete Invoice', () => {
    it('should delete an invoice and return it', async () => {
      const invoiceId = '1';
      const deletedInvoice = { _id: invoiceId, ...invoices[0]};

      const expectedResponse = {
        message: expect.stringContaining('success'),
        data: deletedInvoice
      }
      
      jest.spyOn(invoiceService, 'deleteInvoiceById')
        .mockResolvedValue(deletedInvoice as IInvoice);
      req.params = { id: invoiceId };
      
      await deleteInvoiceById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should return 404 if invoice not found', async () => {
      const invoiceId = '1';
      jest.spyOn(invoiceService, 'deleteInvoiceById').mockResolvedValue(null);
      req.params = { id: invoiceId };

      await deleteInvoiceById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invoice not found'});
    });

    it('should call next with an error if service throws', async () => {
      const invoiceId = '1';
      const mockError = new Error('Database failure');
      req.params = { id: invoiceId };

      jest.spyOn(invoiceService, 'deleteInvoiceById').mockRejectedValue(mockError);

      await deleteInvoiceById(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

});