import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { CustomerBehaviorClusteringStrategy } from '../../src/workers/analytics/customer/CustomerAnalyticsSerializationStrategy';
import { CustomerAnalyticsBuilderStrategyContext } from '../../src/workers/analytics/customer/CustomerAnalyticsBuilderStrategyContext';
import { CustomerBehaviorClusteringAnalyticsBuilderStrategy } from '../../src/workers/analytics/customer/CustomerAnalyticsBuilderStrategy';
import { config } from '../../src/config/config';

describe("Customer Serialization Strategy Class unit tests", () => {

  beforeAll(async () => {
    await mongoose.connect(config.db.mongodbUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();        
  });

  describe("Customer Behavior", () => {
    /**
     * The Strategy Context takes the strategy object and the json string that it needs to serialize.
     */
    it('should run the behavior strategy for serialization and analytics table builder', async () => {
      const mockSerializedData = {
        'spendHigh': ['Name1', 'Name2'],
        'spendNormal': ['Name3', 'Name4'],
        'spendLow': ['Name5'],
        'frequencyHigh': ['Name10', 'Name11'],
        'frequencyNormal': ['Name12'],
        'frequencyLow': ['Name13', 'Name14'],
        'recencyHigh': ['Name6'],
        'recencyNormal': ['Name7', 'Name8'],
        'recencyLow': ['Name9'],        
      }

      const testDataMap = {
        spend: {
          high: ['Name1', 'Name2'],
          normal: ['Name3', 'Name4'],
          low: ['Name5'],
        },
        frequency: {
          high: ['Name10', 'Name11'],
          normal: ['Name12'],
          low: ['Name13', 'Name14'],
        },
        recency: {
          high: ['Name6'],
          normal: ['Name7', 'Name8'],
          low: ['Name9']
        },        
      }

      const jsonData = JSON.stringify(testDataMap);

      const serializationStrategy = new CustomerBehaviorClusteringStrategy();
      const buildAnalyticsStrategy = new CustomerBehaviorClusteringAnalyticsBuilderStrategy();
      const ctx = new CustomerAnalyticsBuilderStrategyContext(
        serializationStrategy,
        buildAnalyticsStrategy,
        jsonData
      );

      const serializedData = ctx.serializeData();
      expect(serializedData).toStrictEqual(mockSerializedData);
      const result = await ctx.buildAnalytics();

      // Check the result's structure.
      // A dictionary of tables.
      const allowedCustomerAttributes = ['id', 'name', 'email']
      Object.entries(result).forEach(([behaviorKey, table]: [string, any]) => {
        if (table[0] == null) {
          return;
        }
        Object.entries(table[0]).forEach(([customerAttribute, value]) => {
          expect(allowedCustomerAttributes).toContain(customerAttribute);          
        });
      });

    });
  })
})