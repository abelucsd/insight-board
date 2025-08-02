import { CustomerAnalyticsSerializationStrategy } from "./CustomerAnalyticsSerializationStrategy"
import { ClusteringResult } from "./types";
import { SerializedBehaviorClusteringResult } from "./customerStrategyReturnTypes";
import { CustomerAnalyticsBuilderStrategy } from './CustomerAnalyticsBuilderStrategy';
import { Analysis } from './types';
import { BuilderBehaviorClusteringResult } from './customerStrategyReturnTypes';
import { getRedis, cacheValue } from "../../../redis/redisClient";
import { createLogger } from "../../../utils/logger";

const logger = createLogger('CustomerAnalyticsBuilderStrategyContext')

export class CustomerAnalyticsBuilderStrategyContext {
  private serializationStrategy: CustomerAnalyticsSerializationStrategy;
  private analysisBuilderStrategy: CustomerAnalyticsBuilderStrategy;
  private data: string;
  private serializedData: null | any = null;

  constructor(
    serializationStrategy: CustomerAnalyticsSerializationStrategy, 
    analysisBuilderStrategy: CustomerAnalyticsBuilderStrategy, 
    data: string
  ) {      
    this.serializationStrategy = serializationStrategy;   
    this.analysisBuilderStrategy = analysisBuilderStrategy; 
    this.data = data;    
  };

  public setSerializationStrategy(serializationStrategy: CustomerAnalyticsSerializationStrategy) {
    this.serializationStrategy = serializationStrategy;
  };
  
  public setAnalysisBuilderStrategy(analysisBuilderStrategy: CustomerAnalyticsBuilderStrategy) {
    this.analysisBuilderStrategy = analysisBuilderStrategy;
  }

  public setData(data: string) {
    this.data = data;
  };

  public serializeData(): SerializedBehaviorClusteringResult {
    this.serializedData = this.serializationStrategy.serializeData(this.data);
    return this.serializedData;
  };

  public async buildAnalytics(): Promise<any> {
    try {
      logger.info(`[buildAnalytics] Serializing Data`)
      logger.info(`[buildAnalytics] Serializing Data`)
      const serializedData = this.serializeData();
      logger.info(`[buildAnalytics] Done serializing data.`)
      logger.info(`[buildAnalytics] Done serializing data.`)
      return await this.analysisBuilderStrategy.buildAnalytics(serializedData);
    } catch (error) {
      throw error;
    }
  };

  public async cacheAnalytics(results: BuilderBehaviorClusteringResult, analysis: string): Promise<String | null> {
    try {
      let retVal = null;
      const validAnalysis = ['customer-behavior'];
      
      
      if (validAnalysis.includes(analysis)) {
        for (const [key, value] of Object.entries(results)) {
          await cacheValue('customers', 'customer-behavior', JSON.stringify(value), key);          
          await cacheValue('customers', 'customer-behavior', JSON.stringify(value), key);          
        };
        retVal = 'success';
      }
      logger.info(`[cacheAnalytics] Done caching the ${validAnalysis} analytics.`)
      logger.info(`[cacheAnalytics] Done caching the ${validAnalysis} analytics.`)
      return retVal;
    } catch (error) {
      throw error;
    };
  };
};