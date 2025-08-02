import express from 'express';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../src/app';

import { IVisit, Visit } from '../../src/models/visit';
import { visitAnalyticsRouter } from '../../src/routes/visitAnalytics.routes';
import { visitAnalyticsService } from '../../src/services/visitAnalytics.service';



describe('Visit API', () => {
  let mongoServer: MongoMemoryServer;  

  // setup and teardown
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
    await Visit.deleteMany({});
  });

  describe('POST /visit/analytics', () => {
    it('should create a new visit', async () => {
      const newVisit = {timestamp: new Date()};
      const response = await request(app).post('/api/visit/analytics').send(newVisit);
      expect(response.status).toBe(201);    
    });

    it('should return 500 if data is invalid', async () => {     
      const invalidVisit = {
        timestamp: 'not-a-date'
      }; 
      const response = await request(app).post('/api/visit/analytics').send(invalidVisit);
      expect(response.status).toBe(500);
    });
  });

  describe('GET /visit/analytics', () => {
    it('should return 200 if successful', 
      async () => {
      const response = await request(app).get('/api/visit/analytics');
      expect(response.status).toBe(200);      
    });    

    it('should return 500 if the service throws', async () => {
      jest
        .spyOn(visitAnalyticsService, 'getVisits')
        .mockRejectedValue(new Error('Database failure'));
      const response = await request(app).get('/api/visit/analytics');
      expect(response.status).toBe(500);
    });
  });
});