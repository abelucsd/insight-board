import { ClusteringResult } from "./types";
import { SerializedBehaviorClusteringResult } from "./customerStrategyReturnTypes";

export interface CustomerAnalyticsSerializationStrategy {
  serializeData(data: string): SerializedBehaviorClusteringResult;
};

export class CustomerBehaviorClusteringStrategy implements CustomerAnalyticsSerializationStrategy {
  public serializeData(data: string): SerializedBehaviorClusteringResult {
    const parsedData: ClusteringResult = JSON.parse(data);
    const spendHigh = parsedData.spend.high;
    const spendNormal = parsedData.spend.normal;
    const spendLow = parsedData.spend.low;

    const frequencyHigh = parsedData.frequency.high;
    const frequencyNormal = parsedData.frequency.normal;
    const frequencyLow = parsedData.frequency.low;

    const recencyHigh = parsedData.recency.high;
    const recencyNormal = parsedData.recency.normal;
    const recencyLow = parsedData.recency.low;

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