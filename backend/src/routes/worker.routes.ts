import express from 'express';
import { loadFile } from '../controllers/worker.controller';

export const workerRouter = express.Router();

workerRouter.get('/load-file', loadFile);