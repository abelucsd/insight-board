import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { CustomerBehaviorClusteringStrategy } from '../../src/workers/analytics/customer/CustomerAnalyticsSerializationStrategy';
import { CustomerAnalyticsSerializationStrategyContext } from '../../src/workers/analytics/customer/CustomerAnalyticsStrategyContext';

describe("Customer Serialization Strategy Class unit tests", () => {
  describe("Customer Behavior", () => {
    /**
     * The Strategy Context takes the strategy object and the json string that it needs to serialize.
     */
    it('should run the behavior strategy', () => {
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

      const strategy = new CustomerBehaviorClusteringStrategy();
      const ctx = new CustomerAnalyticsSerializationStrategyContext(strategy, jsonData);

      const result = ctx.serializeData();

      expect(result).toStrictEqual(mockSerializedData);

    });
  })
})