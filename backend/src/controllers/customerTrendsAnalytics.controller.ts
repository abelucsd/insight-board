import { Request, Response, NextFunction } from 'express';
import { mlTrendsService } from '../services/customerTrendsAnalytics.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('mlTrends.controller');

export const getCustomerTrends = async(
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {
    const { behavior } = req.query;

    if (typeof behavior !== 'string') {
      res.status(400).json({ error: "Invalid behavior type"});
      return
    }

    logger.info(`[getCustomerTrends] Request received.`);
    const response = await mlTrendsService.getCustomerTrends(behavior);
    res.status(200).json({
      message: 'Customer trends retrieved successfully',
      data: response
    });
  } catch (error) {
    next(error);
  }
};