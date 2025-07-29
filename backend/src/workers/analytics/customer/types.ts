export type Analysis = 'customer-behavior' | '';

type ClusterLevel = 'high' | 'normal' | 'low';

export interface CustomerRecord {
  [key: string]: string | number | boolean | null;
};

export interface ClusterCategory {
  high: CustomerRecord[];
  normal: CustomerRecord[];
  low: CustomerRecord[];
};

export interface ClusteringResult {
  spend: ClusterCategory;
  frequency: ClusterCategory;
  recency: ClusterCategory;
};