import { Request, Response } from 'express';
import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

import { 
  getCurrentMonthProfit, 
  getCurrentMonthRevenue, 
  getCurrentMonthInvoices, 
  getMonthlyProfit, 
  getMonthlyRevenue, 
  getMonthlyInvoices, 
  getTopLocationsBySales, 
  getTopProducts 
} from '../../src/controllers/invoiceAnalytics.controller';
import { runInvoiceAnalyticsWorker } from '../../src/services/invoiceAnalytics.service';


jest.mock('../../src/services/invoiceAnalytics.service', () => ({  
  runInvoiceAnalyticsWorker: jest.fn(),
}));

describe("Invoice Analytics end points unit tests", () => {
  let req: Request;
  let res: Response;
  let next: jest.Mock;  
  
  beforeEach(() => {
    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    next = jest.fn();    
  });

  describe('getTopProducts', () => {
    it('should return 200 with mocked variable from service', 
    async () => {
      const mockedResult = {
        message: expect.stringContaining('success'),
        data: true
      };
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        return true;
      });
      
      await getTopProducts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedResult);
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        throw mockError;
      });      
    
      await getTopProducts(req, res, next);
    
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });    
  });


  describe('getMonthlyInvoices', () => {
    it('should return 200 with mocked variable from service', 
    async () => {
      const mockedResult = {
        message: expect.stringContaining('success'),
        data: true
      };
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        return true;
      });
      
      await getMonthlyInvoices(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedResult);
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        throw mockError;
      });    
    
      await getMonthlyInvoices(req, res, next);
    
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });    
  });


  describe('getCurrentMonthInvoices', () => {
    it('should return 200 with mocked variable from service', 
    async () => {
      const mockedResult = {
        message: expect.stringContaining('success'),
        data: true
      };
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        return true;
      });
      
      await getCurrentMonthInvoices(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedResult);
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        throw mockError;
      });    
    
      await getCurrentMonthInvoices(req, res, next);
    
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });    
  });


  describe('getMonthlyRevenue', () => {
    it('should return 200 with mocked variable from service', 
    async () => {
      const mockedResult = {
        message: expect.stringContaining('success'),
        data: true
      };
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        return true;
      });
      
      await getMonthlyRevenue(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedResult);
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        throw mockError;
      });    
    
      await getMonthlyRevenue(req, res, next);
    
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });    
  });


  describe('getCurrentMonthRevenue', () => {
    it('should return 200 with mocked variable from service', 
    async () => {
      const mockedResult = {
        message: expect.stringContaining('success'),
        data: true
      };
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        return true;
      });
      
      await getCurrentMonthRevenue(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedResult);
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        throw mockError;
      });    
    
      await getCurrentMonthRevenue(req, res, next);
    
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });    
  });


  describe('getMonthlyProfit', () => {
    it('should return 200 with mocked variable from service', 
    async () => {
      const mockedResult = {
        message: expect.stringContaining('success'),
        data: true
      };
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        return true;
      });
      
      await getMonthlyProfit(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedResult);
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        throw mockError;
      });    
    
      await getMonthlyProfit(req, res, next);
    
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });    
  });


  describe('getCurrentMonthProfit', () => {
    it('should return 200 with mocked variable from service', 
    async () => {
      const mockedResult = {
        message: expect.stringContaining('success'),
        data: true
      };
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        return true;
      });
      
      await getCurrentMonthProfit(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedResult);
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        throw mockError;
      });    
    
      await getCurrentMonthProfit(req, res, next);
    
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });    
  });


  describe('getTopLocations', () => {
    it('should return 200 with mocked variable from service', 
    async () => {
      const mockedResult = {
        message: expect.stringContaining('success'),
        data: true
      };
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        return true;
      });
      
      await getTopLocationsBySales(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockedResult);
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      (runInvoiceAnalyticsWorker as jest.Mock).mockImplementationOnce(() => {
        throw mockError;
      });    
    
      await getTopLocationsBySales(req, res, next);
    
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  
});