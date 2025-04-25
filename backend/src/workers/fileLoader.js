const { workerData, parentPort } = require('worker_threads');
const path = require('path');

require('ts-node').register();
const { loadFile } = require(path.resolve(__dirname, './fileLoader.ts'));

(async () => {
  try {    
    await loadFile(workerData.filePath);
    parentPort?.postMessage({ message: 'File loaded successfully'});
  } catch (error) {
    console.error('Error loading file:', error.message);
    parentPort?.postMessage({ error: error.message });
  }
})();
