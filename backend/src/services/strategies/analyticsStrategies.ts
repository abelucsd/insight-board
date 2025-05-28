import { getAnalyticsQueue } from "../../workers/queues/analyticsQueue";
import { QueueEvents } from "bullmq";
import { createLogger } from "../../utils/logger";

const logger = createLogger('analyticsStrategies.ts');

const queueEvents = new QueueEvents('analytics');

type AnalyticsStrategyResult = { jobId: string | undefined; status: string };

export const analyticsStrategies: Record<string, () => Promise<AnalyticsStrategyResult>> = {  
  topProducts: async () => {    
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('topProducts', {});    
    return { jobId: job.id, status: 'queued'};
  },
  monthlySales: async () => {
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('monthlySales', {});    
    return { jobId: job.id, status: 'queued'};
  },
  currentMonthSales: async () => {
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('currentMonthSales', {});
    return { jobId: job.id, status: 'queued'};
  },
  monthlyRevenue: async () => {
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('monthlyRevenue', {});
    return { jobId: job.id, status: 'queued'};
  },
  currentMonthRevenue: async () => {
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('currentMonthRevenue', {});
    return { jobId: job.id, status: 'queued'};
  },
  monthlyProfit: async () => {
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('monthlyProfit', {});
    return { jobId: job.id, status: 'queued'};
  },
  currentMonthProfit: async () => {
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('currentMonthProfit', {});
    return { jobId: job.id, status: 'queued'};
  }
};