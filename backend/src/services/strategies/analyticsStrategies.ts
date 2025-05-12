import { getAnalyticsQueue } from "../../workers/queues/analyticsQueue";
import { QueueEvents } from "bullmq";
import { createLogger } from "../../utils/logger";

const logger = createLogger('analyticsStrategies.ts');

const queueEvents = new QueueEvents('analytics');

export const analyticsStrategies: Record<string, () => Promise<void>> = {  
  topProducts: async () => {    
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('topProducts', {});
    const result = await job.waitUntilFinished(queueEvents, 1000);    
    return result;
  },
  monthlySales: async () => {
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('monthlySales', {});
    const result = await job.waitUntilFinished(queueEvents, 1000);
    // const result = await job.returnvalue;
    // logger.info(`[monthlySales] Job completed: ${job.id}, result: ${result}`);
    // console.log("HI")
    return result;
  },
  currentMonthSales: async () => {
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('currentMonthSales', {});
    await job.waitUntilFinished(queueEvents, 1000);
  },
  monthlyRevenue: async () => {
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('monthlyRevenue', {});
    await job.waitUntilFinished(queueEvents, 1000);
  },
  currentMonthRevenue: async () => {
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('currentMonthRevenue', {});
    await job.waitUntilFinished(queueEvents, 1000);
  },
  monthlyProfit: async () => {
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('monthlyProfit', {});
    await job.waitUntilFinished(queueEvents, 1000);
  },
  currentMonthProfit: async () => {
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('currentMonthProfit', {});
    await job.waitUntilFinished(queueEvents, 1000);
  }
};