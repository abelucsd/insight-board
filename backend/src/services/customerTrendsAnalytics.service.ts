import { createLogger } from "../utils/logger";
import { CustomError } from "../errors/CustomError";
import { getRedis } from "../redis/redisClient";
import { getCustomerAnalyticsQueue } from "../workers/queues/customerAnalyticsQueue";

const logger = createLogger('mlTrends.service');

export const mlTrendsService = {
  getCustomerTrends: async (analyticsName: string) => {
    try {
      // Try to get the data from the cache.
      const value = await getRedis().get(`customerAnalytics:${analyticsName}`);
      if (value) {
        return JSON.parse(value);
      }

      // Push the job into the queue.
      let queue = getCustomerAnalyticsQueue();      
      const job = await queue.add(`${analyticsName}`, {});
      return {jobId: job.id, status: 'queued'};      
    } catch (error) {
      const err = new CustomError('Failed to get customer trends', 400);
      throw err;
    }
  }
};