import { isMainThread} from 'worker_threads';
import { Worker, Job } from 'bullmq';
import { getRedis } from '../../../redis/redisClient';
import { createLogger } from '../../../utils/logger';
import { CustomerAnalyticsBuilderStrategyContext} from './CustomerAnalyticsBuilderStrategyContext';
import { CustomerBehaviorClusteringStrategy } from './CustomerAnalyticsSerializationStrategy';
import { CustomerBehaviorClusteringAnalyticsBuilderStrategy } from './CustomerAnalyticsBuilderStrategy';
import { runPythonFile } from './runPythonFile';

const logger = createLogger(`[analytics/customer/worker.ts]`);

let customerAnalyticsWorker: Worker | null = null;
export function startWorker() {
  if (isMainThread) {
      return new Promise<void>((resolve, reject) => {
        if (!customerAnalyticsWorker) {
          customerAnalyticsWorker = new Worker(
            'customerAnalytics',
            async (job: Job) => {
              // delegate the job to a machine learning script and receive a JSON string.
              return await runPythonFile(job.name);
            },
            {
              connection: {
                url: process.env.UPSTASH_REDIS_URL,
                maxRetriesPerRequest: null,
              },
            }
          );
          customerAnalyticsWorker.on('completed', async (job: Job, returnvalue: any) => {
            logger.info(`[Worker]: Completed job ${job.id}`);
            // Strategy algorithm will return a dictionary of stringified values.
            const serializationStrategy = new CustomerBehaviorClusteringStrategy();
            const analysisBuilderStrategy = new CustomerBehaviorClusteringAnalyticsBuilderStrategy();
            const analysisBuilderStrategyCtx = new CustomerAnalyticsBuilderStrategyContext(
              serializationStrategy, 
              analysisBuilderStrategy, 
              returnvalue
            );            
            const results = await analysisBuilderStrategyCtx.buildAnalytics();            
            await analysisBuilderStrategyCtx.cacheAnalytics(results, job.name);
          });
          customerAnalyticsWorker.on('failed', (job: Job | undefined, error: Error, prev: string) => {
            logger.error(`[Worker]: Failed job ${job?.id}, ${error}`)            
          });
          customerAnalyticsWorker.on('error', err => {        
            logger.error(`[Worker]: ${err}`); 
            reject(err);           
          });
          resolve();
        } else {
          resolve();
        }        
      }
    );
  }
};
export async function stopAnalyticsWorker() {
  if (customerAnalyticsWorker) {
    await customerAnalyticsWorker.close();
    customerAnalyticsWorker = null;
  }
};