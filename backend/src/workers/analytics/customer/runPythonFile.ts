import { spawn } from 'child_process';
import path from 'path';
import os from 'os';
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

    const fileName = path.resolve(__dirname, 'pythonMachineLearningAnalytics', 'customerTrendsAnalytics.py');
    const mongoUri = config.db.mongodbUri;
    const dbName = config.db.name;
    const args = [mongoUri, dbName, analysisType];
    const pythonExecutable = os.platform() === 'win32'
      ? path.join(__dirname, '..', '..', '..', '..', '.venv', 'Scripts', 'python.exe')
      : path.join(__dirname, '..', '..', '..', '..', '.venv', 'bin', 'python');    

    logger.info(`[runPythonFile] Running python executable file ${pythonExecutable} with analysis type ${analysisType}.`)

    const pythonProcess = spawn(pythonExecutable, [fileName, ...args]);

    pythonProcess.stdout.on('data', (data) => {
      logger.info(`[runPythonFile] Completed python child process.`)
      result = data.toString();
      
    });
      pythonProcess.stderr.on('data', (data) => {
      logger.error(`[runPythonFile] stderr: ${data}`);      
    });
    pythonProcess.on('error', (err) => {
      logger.error(`[runPythonFile] Error in python process.`)
      reject(err);
    });
    pythonProcess.on('close', (code) => {
      logger.info(`[runPythonFile] Child process exited with code ${code}`);
      if (code == 0) {
        resolve(result);
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });    
  });
};