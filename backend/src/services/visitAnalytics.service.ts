import { createLogger } from '../utils/logger';
import { CustomError } from "../errors/CustomError";
import { IVisit, Visit } from '../models/visit';

const logger = createLogger('visitAnalytics.service');

export const visitAnalyticsService = {
  getVisits: async(): Promise<number> => {
    try {
      logger.info(`[getVisits] Returning number of visits.`);

      const result = await Visit.find({});

      return result.length;
    } catch (error) {
      const err = new CustomError('Failed to fetch visits', 500);
      throw err;
    }
  },
  postVisit: async(timestamp: Date): Promise<IVisit> => {
    try {
      logger.info(`[postVisit] Adding a visit.`);
      
      const result = await Visit.create({timestamp});

      console.log(`After Visit.create(): ${result}`)
      return result;
    } catch (error) {
      const err = new CustomError('Failed to post the visit', 500);
      throw err;
    }
  },
}