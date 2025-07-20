import { ClusteringResult } from "./types";
import { SerializedBehaviorClusteringResult } from "./customerStrategyReturnTypes";

export interface CustomerAnalyticsSerializationStrategy {
  serializeData(data: ClusteringResult): SerializedBehaviorClusteringResult;
};

export class CustomerBehaviorClusteringStrategy implements CustomerAnalyticsSerializationStrategy {
  public serializeData(data: ClusteringResult): SerializedBehaviorClusteringResult {
    const spendHigh = JSON.stringify(data.spend.high);
    const spendNormal = JSON.stringify(data.spend.normal);
    const spendLow = JSON.stringify(data.spend.low);

    const frequencyHigh = JSON.stringify(data.frequency.high);
    const frequencyNormal = JSON.stringify(data.frequency.normal);
    const frequencyLow = JSON.stringify(data.frequency.low);

    const recencyHigh = JSON.stringify(data.recency.high);
    const recencyNormal = JSON.stringify(data.recency.normal);
    const recencyLow = JSON.stringify(data.recency.low);

    return {
      spendHigh,
      spendNormal,
      spendLow,
      frequencyHigh,
      frequencyNormal,
      frequencyLow,
      recencyHigh,
      recencyNormal,
      recencyLow,
    };
  };
};