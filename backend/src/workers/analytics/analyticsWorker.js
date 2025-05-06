const { workerData, parentPort } = require('worker_threads');
const path = require('path');

require('ts-node').register();
const { loadFile } = require(path.resolve(__dirname, './analyticsWorker.ts'));

const { createLogger } = require('../../utils/logger');
const logger = createLogger('analyticsWorker(js)');

(async () => {
  try {
    logger.info(`worker thread: calling getAnalytics()`);
    const result = await getAnalytics(workerData.analyticsType);
    parentPort?.postMessage({
      message: result
    });
  } catch (error) {
    parentPort?.postMessage({ error: error.message });
  }
})