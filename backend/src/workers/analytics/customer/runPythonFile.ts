import { spawn } from 'child_process';
import { createLogger } from '../../../utils/logger';
import { config } from '../../../config/config';


const logger = createLogger(`runPythonFile`)


/**
 * Creats a child process that executes a python script to delegate the machine learning analytics.
 * Commands the python file by providing the type of analysis request, filename, mongo uri, and database name.
 */
export const runPythonFile = async (analysisType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let result: string = '';  

    const fileName = 'customerTrendsAnalytics.py';
    const mongoUri = config.db.mongodbUri;
    const dbName = config.db.name;
    const args = [mongoUri, dbName, analysisType];

    const pythonProcess = spawn('python', [fileName, ...args]);

    pythonProcess.stdout.on('data', (data) => {
      logger.info(`[Worker] Completed python child process.`)
      result = data.toString();
      
    });
      pythonProcess.stderr.on('data', (data) => {
      logger.error(`[Worker] stderr: ${data}`);
      console.log("HIHIHIHI")
    });
    pythonProcess.on('error', (err) => {
      reject(err);
    });
    pythonProcess.on('close', (code) => {
      logger.info(`[Worker] Child process exited with code ${code}`);      
      if (code == 0) {
        resolve(result);
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });            
    return result;
  });
};