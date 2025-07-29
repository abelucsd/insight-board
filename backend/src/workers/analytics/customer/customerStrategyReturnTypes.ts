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
  spendHigh: { name: string; id: string; email: string }[];  
  spendNormal: { name: string; id: string; email: string }[];
  spendLow: { name: string; id: string; email: string }[];
  frequencyHigh: { name: string; id: string; email: string }[];
  frequencyNormal: { name: string; id: string; email: string }[];
  frequencyLow: { name: string; id: string; email: string }[];
  recencyHigh: { name: string; id: string; email: string }[];
  recencyNormal: { name: string; id: string; email: string }[];
  recencyLow: { name: string; id: string; email: string }[];
};