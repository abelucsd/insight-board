import { Queue } from 'bullmq';

let customerAnalyticsQueue: Queue | null = null;

export const getCustomerAnalyticsQueue = (): Queue => {
  if (!customerAnalyticsQueue) {
    customerAnalyticsQueue = new Queue('customerAnalytics', {
      connection: {
        url: process.env.UPSTASH_REDIS_URL,
        maxRetriesPerRequest: null,
      }
    });
  }
  return customerAnalyticsQueue;
};