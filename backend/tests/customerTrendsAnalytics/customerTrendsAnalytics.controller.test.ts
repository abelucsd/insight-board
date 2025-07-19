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
          data: true
        };        
        jest.spyOn(mlTrendsService, 'getCustomerTrends').mockResolvedValue(true);
        await getCustomerTrends(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockedResult);
      }
    );

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('failure');
      jest.spyOn(mlTrendsService, 'getCustomerTrends').mockRejectedValue(mockError);
      await getCustomerTrends(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);

    })
  });
});
