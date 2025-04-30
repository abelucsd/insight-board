import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../utils/logger';

const logger = createLogger('/errorHandler');

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  logger.error(`[${req.method} ${req.url}] ${err.message}\n${err.stack}`);
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};