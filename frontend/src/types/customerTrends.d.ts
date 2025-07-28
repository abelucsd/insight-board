/**
 * We want each table 1 at a time for fast queries from the cache.
 * Request a specific behavior for the backend to serve.
 */
export interface BehaviorClusterCustomers {
  table: { name: string; id: string; email: string }[];
  total: number;
};

export type CustomerTable = BehaviorClusterCustomers['table'];

export type BehaviorType = 'revenue' | 'recency' | 'frequency';

export type LevelType = 'high' | 'normal' | 'low';