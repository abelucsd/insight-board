import { isMainThread} from 'worker_threads';
import { Worker, Job } from 'bullmq';
import { getRedis } from '../../../redis/redisClient';
import { createLogger } from '../../../utils/logger';
import { CustomerAnalyticsSerializationStrategyContext } from './CustomerAnalyticsStrategyContext';
import { CustomerBehaviorClusteringStrategy } from './CustomerAnalyticsSerializationStrategy';
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
            const strategy = new CustomerBehaviorClusteringStrategy();
            const serializationStrategyCtx = new CustomerAnalyticsSerializationStrategyContext(strategy, returnvalue);
            const results = serializationStrategyCtx.serializeData();

            for (const [key, value] of Object.entries(results)) {
              await getRedis().set(`customerAnalytics:${key}`, value);
            }            
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