import { createLogger } from '../utils/logger';
import { analyticsStrategies } from './strategies/analyticsStrategies';
import { getRedis } from "../redis/redisClient";

const logger = createLogger('invoiceAnalytics.service');


export async function runInvoiceAnalyticsWorker(strategy: string) {
  const cacheKey = `invoiceAnalytics:${strategy}`;  
  const cached = await getRedis().get(cacheKey);
  if (cached) {
    logger.info(`[runInvoiceAnalyticsWorker] Cache hit for strategy: ${strategy}`);    
    return JSON.parse(cached);
  }  

  const fn = analyticsStrategies[strategy];
  if (!fn) throw new Error('Invalid strategy');
  const result = await fn();  

  logger.info(`[runInvoiceAnalyticsWorker] Strategy: ${strategy}, Result: ${result}`);
  return result;
};