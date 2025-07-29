import { createLogger } from "../utils/logger";
import { CustomError } from "../errors/CustomError";
import { getRedis } from "../redis/redisClient";
import { getCustomerAnalyticsQueue } from "../workers/queues/customerAnalyticsQueue";

const logger = createLogger('mlTrends.service');

export const mlTrendsService = {
  getCustomerTrends: async (analysis: string, filter: string) => {
    try {
      // Try to get the data from the cache.
      const value = await getRedis().get(`customerAnalytics:${analysis}-${filter}`);
      if (value) {
        return JSON.parse(value);
      }

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