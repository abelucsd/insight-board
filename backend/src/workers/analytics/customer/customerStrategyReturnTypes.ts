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

export interface BuilderBehaviorClusteringResult {
  spendHighTable: { name: string; id: string; email: string }[];  
  spendNormalTable: { name: string; id: string; email: string }[];
  spendLowTable: { name: string; id: string; email: string }[];
  frequencyHighTable: { name: string; id: string; email: string }[];
  frequencyNormalTable: { name: string; id: string; email: string }[];
  frequencyLowTable: { name: string; id: string; email: string }[];
  recencyHighTable: { name: string; id: string; email: string }[];
  recencyNormalTable: { name: string; id: string; email: string }[];
  recencyLowTable: { name: string; id: string; email: string }[];
};