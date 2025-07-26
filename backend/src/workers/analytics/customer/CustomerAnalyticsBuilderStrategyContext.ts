import { CustomerAnalyticsSerializationStrategy } from "./CustomerAnalyticsSerializationStrategy"
import { ClusteringResult } from "./types";
import { SerializedBehaviorClusteringResult } from "./customerStrategyReturnTypes";
import { CustomerAnalyticsBuilderStrategy } from './CustomerAnalyticsBuilderStrategy';

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
    const serializedData = this.serializeData();
    return this.analysisBuilderStrategy.buildAnalytics(serializedData);
  };
};