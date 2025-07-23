import { CustomerRecord } from './types';
export interface SerializedBehaviorClusteringResult {
  spendHigh: CustomerRecord[];
  spendNormal: CustomerRecord[];
  spendLow: CustomerRecord[];
  frequencyHigh: CustomerRecord[];
  frequencyNormal: CustomerRecord[];
  frequencyLow: CustomerRecord[];
  recencyHigh: CustomerRecord[];
  recencyNormal: CustomerRecord[];
  recencyLow: CustomerRecord[];
};