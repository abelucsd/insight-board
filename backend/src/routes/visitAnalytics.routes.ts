import express from 'express';
import { getCurrentMonthVisits, getVisits, postVisit } from '../controllers/visitAnalytics.controller';

export const visitAnalyticsRouter = express.Router();

visitAnalyticsRouter.get('/', getVisits);
visitAnalyticsRouter.post('/', postVisit);
visitAnalyticsRouter.get('/current-month-visits', getCurrentMonthVisits);
