import express, { Router } from 'express';
import { getCustomerTrends } from '../controllers/customerTrendsAnalytics.controller';

export const analyticsRouter = express.Router();

analyticsRouter.get('/customer-trends', getCustomerTrends);