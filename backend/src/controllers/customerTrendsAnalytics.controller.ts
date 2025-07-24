import { Request, Response, NextFunction } from 'express';
import { mlTrendsService } from '../services/customerTrendsAnalytics.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('mlTrends.controller');

export const getCustomerTrends = async(
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {
    logger.info(`[getCustomerTrends] Request received.`);
    const response = await mlTrendsService.getCustomerTrends('customerTrends');
    res.status(200).json({
      message: 'Customer trends retrieved successfully',
      data: response
    });
  } catch (error) {
    next(error);
  }
};