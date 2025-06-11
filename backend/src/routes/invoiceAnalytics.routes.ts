import express, { Router } from 'express';
import { 
  getCurrentMonthProfit, 
  getCurrentMonthRevenue, 
  getCurrentMonthInvoices, 
  getMonthlyProfit, 
  getMonthlyRevenue, 
  getMonthlyInvoices, 
  getTopLocationsBySales, 
  getTopProducts 
} from '../controllers/invoiceAnalytics.controller';

export const invoiceAnalyticsRouter = express.Router();

invoiceAnalyticsRouter.get('/top-products', getTopProducts);
invoiceAnalyticsRouter.get('/monthly-invoices', getMonthlyInvoices);
invoiceAnalyticsRouter.get('/current-month-invoices', getCurrentMonthInvoices);
invoiceAnalyticsRouter.get('/monthly-revenue', getMonthlyRevenue);
invoiceAnalyticsRouter.get('/current-month-revenue', getCurrentMonthRevenue);
invoiceAnalyticsRouter.get('/monthly-profit', getMonthlyProfit);
invoiceAnalyticsRouter.get('/current-monthly-profit', getCurrentMonthProfit);
invoiceAnalyticsRouter.get('/current-month-profit', getCurrentMonthProfit);
invoiceAnalyticsRouter.get('/top-locations-by-sales', getTopLocationsBySales);