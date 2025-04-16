import fs from 'fs';
import path from 'path';

const logDir = path.resolve('logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFilePath = path.join(logDir, 'app.log');

const writeToFile = (level: string, context: string, msg: string) => {
  const timestamp = new Date().toISOString();
  const logLine = `${timestamp} ${level.toUpperCase} [${context}]: ${msg}\n`;
  fs.appendFileSync(logFilePath, logLine);
}

export const createLogger = (context: string) => ({
  info: (msg: string) => {    
    const formatted = `INFO [${context}]: ${msg}`;
    console.log(formatted);
    writeToFile('info', context, formatted);
  },
  error: (msg: string) => {
    const formatted = `ERROR [${context}]: ${msg}`;
    console.log(formatted);
    writeToFile('info', context, formatted);
  },
});