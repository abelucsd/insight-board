import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { createLogger } from '../utils/logger';
import { runFileLoaderWorker } from '../services/file-loader-worker.service';


const logger = createLogger('worker.controller');

export const loadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {    
    logger.info('[loadFile] Request received to load file');    
    const filePath = req.file?.path;
    logger.info(`[loadFile] File path: ${filePath}`); 
    if (!filePath || !fs.existsSync(filePath)) {                  
      res.status(400).json({ error: 'File path is required' });
      return;
    }

    const fileCategory = req.params.fileCategory;
    if (!fileCategory) {
      res.status(400).json({ error: 'File category is required'});
      return;
    }
    const data = await runFileLoaderWorker(filePath as string, fileCategory);

    res.status(200).json(data);
  } catch (error) {        
    next(error);
  }
};