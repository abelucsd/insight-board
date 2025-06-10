/**
 * NOTE: `currentVisits` is included here as a one-off analysis job for Visit KPIs,
 * even though the rest of the strategies are Invoice-related.
 * This avoids creating a separate queue/worker/module for a single analysis.
 * If more Visit-related analytics are added in the future, refactor this strategy
 * into a dedicated Visit analytics module.
 */


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
  },
  topLocationsBySales: async () => {
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('topLocationsBySales', {});
    return { jobId: job.id, status: 'queued'};
  },

  // -----------------------------------------------
  // TEMPORARY: Visit KPI Analysis (Single Use Case)
  // This is a single use case implementation — no general analytics layer for Visits yet.
  // -----------------------------------------------
  currVisits: async () => {
    const analyticsQueue = getAnalyticsQueue()
    const job = await analyticsQueue.add('currVisits', {});
    return { jobId: job.id, status: 'queued'};
  },
};