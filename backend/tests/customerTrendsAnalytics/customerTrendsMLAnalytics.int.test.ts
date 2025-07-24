import { jest } from '@jest/globals';
import { describe, it, expect } from '@jest/globals';
import { spawn } from 'child_process';
import { config } from '../../src/config/config';
import path from 'path';
import os from 'os';
import { ClusteringResult, ClusterCategory } from '../../src/workers/analytics/customer/types';

// Dependencies:
const filePath = path.join(__dirname, '..', '..', 'src', 'workers', 'analytics', 'customer', 'pythonMachineLearningAnalytics', 'customerTrendsAnalytics.py');
const mongoUri = config.db.mongodbUri;
const dbName = 'test';
const pythonExecutable = os.platform() === 'win32'
  ? path.join(__dirname, '..', '..', '.venv', 'Scripts', 'python.exe')
  : path.join(__dirname, '..', '..', '.venv', 'bin', 'python');

describe("Customer Trends Analytics - Integration Test with the Python machine learning algorithms", () => {
  describe('runPythonFile', () => {

    /**
     * Relies on a callback to inform Jest that the test has finished. 
     * Call the done function after the assertions to ensure the callback completes before finishing the test.
     */    
    it('should run the python file with a resolved promise.', done => {      
      const analysisType = 'behavior';
      const args = [mongoUri, dbName, analysisType];

      const pythonProcess = spawn(pythonExecutable, [filePath, ...args]);

      // set up listeners
      let result = ''
      pythonProcess.stdout.on('data', (data) => {
        result += data;        
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`${data.toString()}`)
      });

      pythonProcess.on('close', (code) => {        
        expect(code).toBe(0);
        done();
      });
    }, 30000)

    it('should receive correct map structure from stdout', done => {      
      const analysisType = 'behavior';
      const args = [mongoUri, dbName, analysisType];

      const pythonProcess = spawn(pythonExecutable, [filePath, ...args]);

      // set up listeners
      let result = ''
      pythonProcess.stdout.on('data', (data) => {
        result += data;        
      });      

      pythonProcess.stderr.on('data', (data) => {
        console.error(`${data.toString()}`)
      });

      pythonProcess.on('close', (code) => {        
        // parse the data and check the structure
        const parsedData = JSON.parse(result);    

        // Check the structure
        expect(Object.keys(parsedData)).toEqual(expect.arrayContaining(['spend', 'recency', 'frequency']));
        expect(Object.keys(parsedData.spend)).toEqual(expect.arrayContaining(['high', 'normal', 'low']));
        expect(Object.keys(parsedData.recency)).toEqual(expect.arrayContaining(['high', 'normal', 'low']));
        expect(Object.keys(parsedData.frequency)).toEqual(expect.arrayContaining(['high', 'normal', 'low']));

        // Check if the data has CustomerRecord(s).        
        const spendHighData: ClusterCategory[] = parsedData.spend.high;
        const expectedAttributes = ['total_spend', 'num_purchases', 'recency', 'avg_purchase', 'frequency', 'cluster']
        Object.entries(spendHighData[0]).forEach(([key, value]) => {           
          expect(typeof key).toBe('string');
          expect(typeof value).toBe('number');
          expect(expectedAttributes).toContain(key);
        });


        // Test CustomerRecord objects.
        const clusteringData: ClusteringResult = parsedData;
        Object.entries(clusteringData).forEach(([featKey, feature]) => {          
          Object.entries(feature).forEach(([docsKey, documents]) => {            
            if (Array.isArray(documents) && documents.length > 0) {
              const sample = documents[0];
              Object.entries(sample).forEach(([attr, value]) => {                
                expect(typeof attr).toBe('string');
                expect(typeof value).toBe('number');
                expect(expectedAttributes).toContain(attr);                 
              })
            }
          })
        })

        expect(code).toBe(0);
        done();
      });
    }, 30000)
    
    it('should run the python file and receive an exit code 1', done => {      
      const analysisType = 'behavior';
      const args = [mongoUri, 'fail', analysisType];

      const pythonProcess = spawn(pythonExecutable, [filePath, ...args]);

      // set up listeners
      let result = ''
      pythonProcess.stdout.on('data', (data) => {
        result += data;        
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`${data.toString()}`)
      });

      pythonProcess.on('close', (code) => {        
        expect(code).toBe(1);
        done();
      });
    }, 30000)

    it('should pass insufficient args to the python file.', done => {            
      const args = [mongoUri, dbName];

      const pythonProcess = spawn(pythonExecutable, [filePath, ...args]);

      // set up listeners
      let result = ''
      pythonProcess.stdout.on('data', (data) => {
        result += data;        
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`${data.toString()}`)
      });

      pythonProcess.on('close', (code) => {
        
        expect(code).toBe(1);
        done();
      });      
    }, 30000)
  })
})