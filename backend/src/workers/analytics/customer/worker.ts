import { isMainThread} from 'worker_threads';
import { Worker, Job } from 'bullmq';
import { getRedis } from '../../../redis/redisClient';
import { spawn } from 'child_process';
import { createLogger } from '../../../utils/logger';
import { ClusteringResult } from './types';

const logger = createLogger(`[analytics/customer/worker.ts]`);

let customerAnalyticsWorker: Worker | null = null;
export function startWorker() {
  if (isMainThread) {
      return new Promise((resolve, reject) => {
        if (!customerAnalyticsWorker) {
          customerAnalyticsWorker = new Worker(
            'customerAnalytics',
            async (job: Job) => {

            let result: string | null = null;            
            result = await new Promise((resolve, reject) => {
              const fileName = 'mlFile.py';
              const args = job.name;
              const pythonProcess = spawn('python', [fileName, args]);
              pythonProcess.stdout.on('data', (data) => {
                logger.info(`[Worker] Completed python child process.`)
                result = data;
              });
                pythonProcess.stderr.on('data', (data) => {
                logger.error(`[Worker] stderr: ${data}`);
              });
              pythonProcess.on('close', (code) => {
                logger.info(`[Worker] Child process exited with code ${code}`);
              });            
              return result;
            })

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
            // TODO: Use strategy pattern to store result into redis cache.
            await getRedis().set(`customerAnalytics:${job.name}`, JSON.stringify(returnvalue));
          });
          customerAnalyticsWorker.on('failed', (job: Job | undefined, error: Error, prev: string) => {
            logger.error(`[Worker]: Failed job ${job?.id}, ${error}`)
          });
          customerAnalyticsWorker.on('error', err => {        
            logger.error(`[Worker]: ${err}`);
          });
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