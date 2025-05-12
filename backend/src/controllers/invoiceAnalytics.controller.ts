import { Request, Response, NextFunction } from 'express';
import { Invoice } from '../models/invoice';
import { runInvoiceAnalyticsWorker } from '../services/invoiceAnalytics.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('invoiceAnalytics.controller');


export const getTopProducts = async (
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {
    logger.info(`[getTopProducts] Request receieved.`)
    const response = await runInvoiceAnalyticsWorker('topProducts');    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getMonthlySales = async (
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {
    logger.info(`[getMonthlySales] Request receieved.`)
    const response = await runInvoiceAnalyticsWorker('monthlySales');    
    res.status(200).json(response);    
  } catch (error) {
    next(error);
  }
};

export const getCurrentMonthSales = async (
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {
    logger.info(`[getCurrentMonthSales] Request receieved.`)
    const response = await runInvoiceAnalyticsWorker('currentMonthSales');    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getMonthlyRevenue = async (
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {
    logger.info(`[getMonthlyRevenue] Request receieved.`)
    const response = await runInvoiceAnalyticsWorker('monthlyRevenue');    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getCurrentMonthRevenue = async (
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {
    logger.info(`[getCurrentMonthRevenue] Request receieved.`)
    const response = await runInvoiceAnalyticsWorker('currentMonthRevenue');    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getMonthlyProfit = async (
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {
    logger.info(`[getMonthlyProfit] Request receieved.`)
    const response = await runInvoiceAnalyticsWorker('monthlyProfit');    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getCurrentMonthProfit = async (
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {
    logger.info(`[getCurrentMonthSales] Request receieved.`)
    const response = await runInvoiceAnalyticsWorker('currentMonthProfit');    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// TODO: full workflow
export const getTopLocations = async (
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {
    logger.info(`[getTopLocations] Request receieved.`)
    const response = await runInvoiceAnalyticsWorker('topLocations');    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};