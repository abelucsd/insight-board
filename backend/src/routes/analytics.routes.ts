import express, { Router } from 'express';
import { getCustomerTrends } from '../controllers/customerTrendsAnalytics.controller';

export const analytics = express.Router();

analytics.get('/', getCustomerTrends);