import express from 'express';
import { getVisits, postVisit } from '../controllers/visitAnalytics.controller';

export const visitAnalyticsRouter = express.Router();

visitAnalyticsRouter.get('/', getVisits);
visitAnalyticsRouter.post('/', postVisit);
