import { Request, Response } from 'express';
import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach, beforeAll, afterAll } from '@jest/globals';
import fs from 'fs';
import path from 'path';

import { loadCSV, loadJSON } from '../src/workers/fileLoader';
import { runFileLoaderWorker } from '../src/services/file-loader-worker.service';
import { IProduct } from '../src/models/product';
import { loadFile } from '../src/controllers/worker.controller';
import * as fileLoaderWorkerService from '../src/services/file-loader-worker.service';

describe('loadFile function', () => {
  let mockProducts: IProduct[] = [];
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  
  beforeEach(() => {    
      mockProducts = [];
  
      req = {} as Request;
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      next = jest.fn();
    });

  it('should return 400 if filePath is missing', async () => {
    req.query = {};
    await loadFile(req as Request, res as Response, next);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'File path is required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call runFileLoaderWorker with filePath and return data on success', async () => {        
    req.query = { filePath: '../fixtures/sample.csv' };
        
    const mockData = { message: 'File loaded successfully' };
    jest.spyOn(fileLoaderWorkerService, 'runFileLoaderWorker')
      .mockResolvedValue(mockData as {message: string});
    
    await loadFile(req as Request, res as Response, next);
    
    expect(runFileLoaderWorker).toHaveBeenCalledWith('../fixtures/sample.csv');
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
    
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with an error if runFileLoaderWorker fails', async () => {
    req.query = { filePath: '../fixtures/sample.csv' };
    
    const mockError = new Error('File loading failed');
    jest.spyOn(fileLoaderWorkerService, 'runFileLoaderWorker')
      .mockRejectedValue(mockError);
    
    await loadFile(req as Request, res as Response, next);
    
    expect(next).toHaveBeenCalledWith(mockError);
    expect(res.json).not.toHaveBeenCalled();
  });
});


describe('loadCSV', () => {
  const testFilePath = path.join(__dirname, 'test.csv');

  beforeAll(async () => {
    const testData = `name,age\nAlice,30\nBob,25`;
    await fs.writeFileSync(testFilePath, testData, 'utf8');
  });

  afterAll(async () => {
    await fs.unlinkSync(testFilePath);
  });

  it('should parse CSV file into array of rows', async () => {
    const result = await loadCSV(testFilePath);
    expect(result).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ]);
  });

  it('should throw a CustomError if file does not exist', async () => {
    await expect(loadCSV('nonexistent.csv')).rejects.toThrow('Failed to read CSV file');
  });
});


describe('loadJSON', () => {
  const testFilePath = path.resolve(__dirname, 'test.json');

  const sampleData = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 }
  ];

  beforeAll(() => {
    fs.writeFileSync(testFilePath, JSON.stringify(sampleData, null, 2), 'utf8');
  });

  afterAll(() => {
    fs.unlinkSync(testFilePath);
  });

  it('should parse a valid JSON file correctly', async () => {
    const result = await loadJSON(testFilePath);
    expect(result).toEqual(sampleData);
  });

  it('should throw a CustomError for invalid JSON', async () => {
    const badFilePath = path.resolve(__dirname, 'bad.json');
    fs.writeFileSync(badFilePath, 'invalid json!', 'utf8');

    await expect(loadJSON(badFilePath)).rejects.toThrow('Failed to read JSON file');

    fs.unlinkSync(badFilePath);
  });
});