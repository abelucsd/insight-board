import { Worker } from 'worker_threads';
import path from 'path';
import { IInvoice } from '../models/invoice';
import { createLogger } from '../utils/logger';
import { analyticsStrategies } from './strategies/analyticsStrategies';

const logger = createLogger('invoiceAnalytics.service');


export async function runInvoiceAnalyticsWorker(strategy: string) {
  const fn = analyticsStrategies[strategy];
  if (!fn) throw new Error('Invalid strategy');
  const result = await fn();

  logger.info(`[runInvoiceAnalyticsWorker] Strategy: ${strategy}, Result: ${result}`);
  return result;
};