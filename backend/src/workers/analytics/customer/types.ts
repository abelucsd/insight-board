type ClusterLevel = 'high' | 'normal' | 'low';

interface CustomerRecord {
  [key: string]: string | number | boolean | null;
};

interface ClusterCategory {
  high: CustomerRecord[];
  normal: CustomerRecord[];
  low: CustomerRecord[];
};

export interface ClusteringResult {
  spend: ClusterCategory;
  frequency: ClusterCategory;
  recency: ClusterCategory;
};