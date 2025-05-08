import { Worker } from 'worker_threads';
import path from 'path';
import { IInvoice } from '../models/invoice';
import { createLogger } from '../utils/logger';

const logger = createLogger('invoiceAnalytics.service');

export function runInvoiceAnalyticsWorker(
  analyticsType: string
) : Promise<IInvoice[]> {
  
  logger.info(`[runInvoiceAnalyticsWorker] Creating a worker.`);

  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(
      __dirname, 
      '../workers/analytics/worker.js'
    ), {
      workerData: {analyticsType},
    });

    worker.on('message', (data) => {
      logger.info('[runInvoiceAnalyticsWorker] successful worker - resolving data.')
      resolve(data);
    });

    worker.on('error', (error) => {
      reject(error);
    });

    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
};