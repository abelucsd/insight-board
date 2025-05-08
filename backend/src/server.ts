import app from './app';
import { config } from './config/config';
import { getDb } from './db/db';
import { createLogger } from './utils/logger';
import dotenv from 'dotenv';

const logger = createLogger('server.ts');


async function startServer() {
  try {
    await getDb();
    app.listen(config.port, () => {      
      logger.info(`[startServer()] Server is running on port ${config.port}`);
    });
  } catch (error) {
    logger.error(`[startServer()] Error starting server: ${error}`);
    process.exit(1);
  }
};

startServer();