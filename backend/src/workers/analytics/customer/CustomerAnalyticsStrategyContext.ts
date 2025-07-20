import { CustomerAnalyticsSerializationStrategy } from "./CustomerAnalyticsSerializationStrategy"
import { ClusteringResult } from "./types";
import { SerializedBehaviorClusteringResult } from "./customerStrategyReturnTypes";

export class CustomerAnalyticsSerializationStrategyContext {
  private strategy: CustomerAnalyticsSerializationStrategy;
  private data: ClusteringResult;

  constructor(strategy: CustomerAnalyticsSerializationStrategy, data: ClusteringResult) {
    this.strategy = strategy;    
    this.data = data;
  };

  public setStrategy(strategy: CustomerAnalyticsSerializationStrategy) {
    this.strategy = strategy;
  };

  public setData(data: ClusteringResult) {
    this.data = data;
  };

  public serializeData(): SerializedBehaviorClusteringResult {    
    return this.strategy.serializeData(this.data);
  };
};