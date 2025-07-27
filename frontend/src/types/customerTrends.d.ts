/**
 * We want each table 1 at a time for fast queries from the cache.
 * Request a specific behavior for the backend to serve.
 */
export interface BehaviorClusterCustomers {
  customerTable: { name: string; id: string; email: string }[];
};