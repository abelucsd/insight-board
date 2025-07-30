import { Request, Response } from 'express';
import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { 
  getCustomerTrends
} from '../../src/controllers/customerTrendsAnalytics.controller';
import { mlTrendsService } from '../../src/services/customerTrendsAnalytics.service';


describe("Customer trends analytics end points unit tests", () => {
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

  describe('getCustomerTrends', () => {
    it('should return 200',
      async () => {
        const mockedResult = {
          message: expect.stringContaining('success'),
          data: {
            data: true,
            total: 10,
          }
        };        
        req.query = {
          analysis: 'customer-behavior',
          filter: 'highSpend',  
          page: '1',
          limit: '10',
        };

        jest.spyOn(mlTrendsService, 'getCustomerTrends').mockResolvedValue({data: true, total: 10});
        await getCustomerTrends(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockedResult);
      }
    );

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('failure');
      req.query = {
        analysis: 'customer-behavior',
        filter: 'highSpend',  
        page: '1',
        limit: '10',
      };
      jest.spyOn(mlTrendsService, 'getCustomerTrends').mockRejectedValue(mockError);
      await getCustomerTrends(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);

    });

    it('should return a 400 status code with missing request parameters', async () => {
      req.query = {}
      const result = await getCustomerTrends(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    })
  });
});
