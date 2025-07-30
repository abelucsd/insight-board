import { Request, Response, NextFunction } from 'express';
import { mlTrendsService } from '../services/customerTrendsAnalytics.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('mlTrends.controller');

export const getCustomerTrends = async(
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {    
    logger.info(`[getCustomerTrends] Request received.`);        
    
    if (req.query.analysis == null || req.query.filter == null) {    
      
      res.status(400).json({
        error: 'Missing request parameters.'
      });
      return;
    };
    const { analysis, filter, page, limit, search } = req.query;

    console.log("Going into the service layer.")

    const response = await mlTrendsService.getCustomerTrends(analysis as string, filter as string);
    res.status(200).json({
      message: 'Customer trends retrieved successfully',
      data: response
    });
  } catch (error) {
    next(error);
  }
};