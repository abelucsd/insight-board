import { createLogger } from "../utils/logger";
import { CustomError } from "../errors/CustomError";
import { getRedis, getValue } from "../redis/redisClient";
import { getCustomerAnalyticsQueue } from "../workers/queues/customerAnalyticsQueue";

const logger = createLogger('mlTrends.service');

export const mlTrendsService = {
  getCustomerTrends: async (analysis: string, filter: string, page: number, limit: number) => {
    try {
      // Try to get the data from the cache.            
      const data = await getValue('customers', 'customer-behavior', filter);      
      if (data) {
        logger.info(`[getCustomerTrends] Data was cached.`)
        const parsedData: string[] = JSON.parse(data);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedData = parsedData.slice(startIndex, endIndex);
        return { customerTable: paginatedData, total: parsedData.length };                     
      }

      logger.info(`[getCustomerTrends] Pushing job into the queue.`)

      // Push the job into the queue.
      let queue = getCustomerAnalyticsQueue();      
      const job = await queue.add(`${analysis}`, {});
      return {jobId: job.id, status: 'queued'};      
    } catch (error) {
      const err = new CustomError('Failed to get customer trends', 404);
      throw err;
    }
  }
};