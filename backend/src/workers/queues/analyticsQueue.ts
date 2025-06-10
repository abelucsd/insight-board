import { Queue } from "bullmq";

let analyticsQueue: Queue | null = null;

export const getAnalyticsQueue = (): Queue => {
  if (!analyticsQueue) {
    analyticsQueue = new Queue('analytics', {
      connection: {
        url: process.env.UPSTASH_REDIS_URL,
        maxRetriesPerRequest: null,
      }
    });
  }
  return analyticsQueue;
};