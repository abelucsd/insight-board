import { Worker } from "bullmq";
import { redis } from "../../redis/redisClient";
import { getAnalytics } from "./handleAnalyticsJob";
import { createLogger } from "../../utils/logger";

const logger = createLogger('analyticsWorker.ts')

let analyticsWorker: Worker | null = null;

export function startAnalyticsWorker(): Promise<void> {
  return new Promise((resolve) => {
    if (!analyticsWorker) {
      analyticsWorker = new Worker(
        'analytics',
        async (job) => {
          const result = await getAnalytics(job.name);
          return result;
        },
        { connection: redis }
      );

      analyticsWorker.on('completed', (job) => {
        logger.info(`[Worker] Completed job ${job.id} ${job.returnvalue}.`);
        resolve(job.returnvalue);
      });

      analyticsWorker.on('failed', (job, err) => {
        logger.error(`[Worker] Failed job ${job?.id}, ${err}`);
      });
    }

  });
}
export async function stopAnalyticsWorker() {
  if (analyticsWorker) {
    await analyticsWorker.close();
    analyticsWorker = null;
  }
}