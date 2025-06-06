import { Request, Response, NextFunction } from 'express';
import { visitAnalyticsService } from '../services/visitAnalytics.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('visitAnalytics.controller');


export const getVisits = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info(`[getVisits] Request received.`);

    const result = await visitAnalyticsService.getVisits();

    res.status(200).json({
      message: 'Visits received successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const postVisit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info(`[postVisit] Request received.`);
    const { timestamp } = req.body;
    const result = await visitAnalyticsService.postVisit(timestamp);

    res.status(201).json({
      message: 'Visit posted successfully.',
      data: result,
    })
  } catch (error) {
    next(error);
  }
};