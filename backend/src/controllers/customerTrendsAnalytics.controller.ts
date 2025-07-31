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
    const analysis = req.query.analysis as string;
    const filter = req.query.filter as string;
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const search = parseInt(req.query.search as string);

    logger.info(`[getCustomerTrends] Query according to ${analysis} and ${filter}`)

    const response = await mlTrendsService.getCustomerTrends(analysis as string, filter as string, page, limit);
    res.status(200).json({
      message: 'Customer trends retrieved successfully',
      data: response
    });
  } catch (error) {
    next(error);
  }
};