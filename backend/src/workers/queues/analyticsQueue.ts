import { Queue } from "bullmq";
import { redis } from '../../redis/redisClient';

let analyticsQueue: Queue | null = null;

export const getAnalyticsQueue = (): Queue => {
  if (!analyticsQueue) {
    analyticsQueue = new Queue('analytics', {connection: redis});
  }
  return analyticsQueue;
};