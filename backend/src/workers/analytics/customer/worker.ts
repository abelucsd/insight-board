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
              try {
                // delegate the job to a machine learning script and receive a JSON string.
                const result =  await runPythonFile(job.name);
                logger.info(`[Worker]: Results from runPythonFile--${result}`)
                return result;
              } catch (error) {
                logger.error(`[Worker]: Failed python file workflow. ${error}`);
              }
            },
            {
              connection: {
                url: process.env.UPSTASH_REDIS_URL,
                maxRetriesPerRequest: null,
              },
            }
          );
          customerAnalyticsWorker.on('completed', async (job: Job, value: any) => {
            try {
              logger.info(`[Worker]: Completed job ${job.id}`);
              // Strategy algorithm will return a dictionary of stringified values.
              const serializationStrategy = new CustomerBehaviorClusteringStrategy();
              const analysisBuilderStrategy = new CustomerBehaviorClusteringAnalyticsBuilderStrategy();
              const analysisBuilderStrategyCtx = new CustomerAnalyticsBuilderStrategyContext(
                serializationStrategy, 
                analysisBuilderStrategy, 
                value
              );
              const results = await analysisBuilderStrategyCtx.buildAnalytics();            
              await analysisBuilderStrategyCtx.cacheAnalytics(results, job.name);
            } catch (error) {
              logger.error(`[Worker]: Failed during transform and load results into the cache. ${error}`);
            }
          });
          customerAnalyticsWorker.on('failed', (job: Job | undefined, error: Error, prev: string) => {
            logger.error(`[Worker]: Failed job ${job?.id}, ${error}`);
          });
          customerAnalyticsWorker.on('error', error => {
            logger.error(`[Worker]: ${error}`); 
            reject(error);
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