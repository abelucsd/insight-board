import { Request, Response, NextFunction } from 'express';
import { createLogger } from '../utils/logger';
import { runFileLoaderWorker } from '../services/file-loader-worker.service';


const logger = createLogger('worker.controller');

export const loadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { filePath } = req.query;
    if (!filePath) {
      logger.error('[loadFile] File path is required');
      res.status(400).json({ error: 'File path is required' });
      return;
    }

    const data = await runFileLoaderWorker(filePath as string);
    res.status(200).json(data);
  } catch (error) {        
    next(error);
  }
};