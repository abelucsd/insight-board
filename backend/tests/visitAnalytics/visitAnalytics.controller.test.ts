import { Request, Response } from 'express';
import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

import { getVisits, postVisit } from '../../src/controllers/visitAnalytics.controller';
import { visitAnalyticsService } from '../../src/services/visitAnalytics.service';
import { IVisit } from '../../src/models/visit';

describe("Visit Analytics end points unit tests", () => {
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

  describe('getVisits', () => {
    it('should return 200 with mocked variable from service',
      async () => {
        const mockedResult = {
          message: expect.stringContaining('success'),
          data: 1
        };
        jest.spyOn(visitAnalyticsService, 'getVisits').mockResolvedValue(mockedResult.data);

        await getVisits(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockedResult);
      }
    );

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      jest.spyOn(visitAnalyticsService, 'getVisits').mockRejectedValue(mockError);

      await getVisits(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('postVisit', () => {
    it('should return 200 with mocked variable from service',
      async () => {        
        req.body = { timestamp: new Date }

        const data: IVisit = {            
          timestamp: new Date(),
        }
        const mockedResult = {
          message: expect.stringContaining('success'),   
          data: data
        };
        jest.spyOn(visitAnalyticsService, 'postVisit').mockResolvedValue(data);

        await postVisit(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockedResult);
      }
    );

    it('should call next with an error if service throws', async () => {
      req.body = { timestamp: new Date }
      const mockError = new Error('Database failure');      
      jest.spyOn(visitAnalyticsService, 'postVisit').mockRejectedValue(mockError);

      await postVisit(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});