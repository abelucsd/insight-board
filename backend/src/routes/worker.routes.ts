import express from 'express';
import { loadFile } from '../controllers/worker.controller';
import { upload } from '../middlewares/multer.middleware';

export const workerRouter = express.Router();

workerRouter.post('/upload-file', upload.single('file'), loadFile);