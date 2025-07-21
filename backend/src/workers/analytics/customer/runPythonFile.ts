import { spawn } from 'child_process';
import { createLogger } from '../../../utils/logger';
import { CustomError } from '../../../errors/CustomError';

const logger = createLogger(`runPythonFile`)

export const runPythonFile = async (analysisType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let result: string = '';  
    const fileName = 'mlFile.py';
    const args = [analysisType];
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