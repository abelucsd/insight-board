import express from 'express';
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { invoiceAnalyticsRouter } from '../../src/routes/invoiceAnalytics.routes';
import { Invoice } from '../../src/models/invoice';
import { invoiceData } from '../utils/data';
import { getMonthlyData, getCurrMonthData, getTopByAttribute } from '../../src/workers/analytics/handleAnalyticsJob';


// const app = express();
// app.use(express.json());
// app.use('/api/invoice/analytics', invoiceAnalyticsRouter);


describe('Invoice Analytics API', () => {
  let mongoServer: MongoMemoryServer;  

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {    
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();    
  });

  beforeEach(async () => {    
    await Invoice.insertMany(invoiceData);
  });

  afterEach(async () => {
    await Invoice.deleteMany({});
  });


  describe('getTopByAttribute() helper function', () => {
    it('should return the top products', async() => {
      const result = await getTopByAttribute('products');
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            attribute: expect.any(String),
            count: expect.any(Number)
          }),          
        ])
      );
    });
  });

  
  describe('getMonthlyData() helper function', () => {
    it('should return the monthly invoices', async() => {
      const result = await getMonthlyData('invoices');
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            total: expect.any(Number),
            month: expect.any(String)
          })
        ])
      );
    });    

    it('should return the monthly revenue', async() => {
      const result = await getMonthlyData('revenue');
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            total: expect.any(Number),
            month: expect.any(String)
          })
        ])
      );
    });

    it('should return the monthly profit', async() => {
      const result = await getMonthlyData('profit');
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            total: expect.any(Number),
            month: expect.any(String)
          })
        ])
      );
    });

    it('should throw an error when injected an invalid category', async() => {
      await expect(getMonthlyData('invalidType')).rejects.toThrow('Unhandled');
    });
  });

  
  describe('getCurrMonthData() helper function', () => {
    it('should return the current month invoices data', async() => {
      const result = await getCurrMonthData('invoices');
      expect(result).toEqual(        
        expect.objectContaining({
          total: expect.any(Number),
          growth: expect.any(Number)
        })        
      );
    });

    it('should return the current month revenue data', async() => {
      const result = await getCurrMonthData('revenue');      
      expect(result).toEqual(        
        expect.objectContaining({
          total: expect.any(Number),
          growth: expect.any(Number)
        })        
      );
    });

    it('should return the current month profit data', async() => {
      const result = await getCurrMonthData('profit');
      expect(result).toEqual(        
        expect.objectContaining({
          total: expect.any(Number),
          growth: expect.any(Number)
        })        
      );
    });

    it('should throw an error when injected an invalid category', async() => {
      await expect(getCurrMonthData('invalidType')).rejects.toThrow('Unhandled');
    });
  });

});