import express, { Router } from 'express';
import { 
  getCurrentMonthProfit, 
  getCurrentMonthRevenue, 
  getCurrentMonthSales, 
  getMonthlyProfit, 
  getMonthlyRevenue, 
  getMonthlySales, 
  getTopLocationsBySales, 
  getTopProducts 
} from '../controllers/invoiceAnalytics.controller';

export const invoiceAnalyticsRouter = express.Router();

invoiceAnalyticsRouter.get('/top-products', getTopProducts);
invoiceAnalyticsRouter.get('/monthly-sales', getMonthlySales);
invoiceAnalyticsRouter.get('/current-month-sales', getCurrentMonthSales);
invoiceAnalyticsRouter.get('/monthly-revenue', getMonthlyRevenue);
invoiceAnalyticsRouter.get('/current-month-revenue', getCurrentMonthRevenue);
invoiceAnalyticsRouter.get('/monthly-profit', getMonthlyProfit);
invoiceAnalyticsRouter.get('/current-monthly-profit', getCurrentMonthProfit);
invoiceAnalyticsRouter.get('/current-month-profit', getCurrentMonthProfit);
invoiceAnalyticsRouter.get('/top-locations-by-sales', getTopLocationsBySales);