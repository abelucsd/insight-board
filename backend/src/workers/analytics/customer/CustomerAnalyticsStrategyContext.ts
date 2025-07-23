import { CustomerAnalyticsSerializationStrategy } from "./CustomerAnalyticsSerializationStrategy"
import { ClusteringResult } from "./types";
import { SerializedBehaviorClusteringResult } from "./customerStrategyReturnTypes";

export class CustomerAnalyticsSerializationStrategyContext {
  private strategy: CustomerAnalyticsSerializationStrategy;
  private data: string;

  constructor(strategy: CustomerAnalyticsSerializationStrategy, data: string) {
    this.strategy = strategy;    
    this.data = data;
  };

  public setStrategy(strategy: CustomerAnalyticsSerializationStrategy) {
    this.strategy = strategy;
  };

  public setData(data: string) {
    this.data = data;
  };

  public serializeData(): SerializedBehaviorClusteringResult {
    return this.strategy.serializeData(this.data);
  };
};