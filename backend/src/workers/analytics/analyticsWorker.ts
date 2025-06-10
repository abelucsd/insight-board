import { Worker } from "bullmq";
import { redis } from "../../redis/redisClient";
import { getAnalytics } from "./handleAnalyticsJob";
import { createLogger } from "../../utils/logger";

const logger = createLogger('analyticsWorker.ts')

let analyticsWorker: Worker | null = null;

export function startAnalyticsWorker() {  
    if (!analyticsWorker) {
      analyticsWorker = new Worker(
        'analytics',
        async (job) => {
          const result = await getAnalytics(job.name);
          console.log(`[Worker] Job ${job.name} completed with result:`, result);
          await redis.set(`invoiceAnalytics:${job.name}`, JSON.stringify(result));
        },
        { 
          connection: {
            url: process.env.UPSTASH_REDIS_URL,
            maxRetriesPerRequest: null,
          }
        }
      );

      analyticsWorker.on('completed', (job) => {
        logger.info(`[Worker] Completed job ${job.id} ${job.returnvalue}.`);        
      });

      analyticsWorker.on('failed', (job, err) => {
        logger.error(`[Worker] Failed job ${job?.id}, ${err}`);
      });
    }
  
}
export async function stopAnalyticsWorker() {
  if (analyticsWorker) {
    await analyticsWorker.close();
    analyticsWorker = null;
  }
}