import { Request, Response, NextFunction } from 'express';
import { mlTrendsService } from '../services/customerTrendsAnalytics.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('mlTrends.controller');

export const getCustomerTrends = async(
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {    
    logger.info(`[getCustomerTrends] Request received.`);        
    
    if (req.params.analysis == null || req.params.filter == null) {    
      console.log("null or undef")  
      res.status(400).json({
        error: 'Missing request parameters.'
      });
      return;
    };    
    const { analysis, filter } = req.params;

    const response = await mlTrendsService.getCustomerTrends(analysis, filter);
    res.status(200).json({
      message: 'Customer trends retrieved successfully',
      data: response
    });
  } catch (error) {
    next(error);
  }
};