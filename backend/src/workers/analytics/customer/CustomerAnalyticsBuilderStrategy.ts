import { ClusteringResult } from "./types";
import { SerializedBehaviorClusteringResult } from "./customerStrategyReturnTypes";
import { Customer } from '../../../models/customer';
import { BuilderBehaviorClusteringResult } from './customerStrategyReturnTypes';

export interface CustomerAnalyticsBuilderStrategy {
  buildAnalytics(data: SerializedBehaviorClusteringResult): Promise<BuilderBehaviorClusteringResult>;
};

/**
 * Should expected serialized data in the form of key value pairs.
 */
export class CustomerBehaviorClusteringAnalyticsBuilderStrategy implements CustomerAnalyticsBuilderStrategy {
  public async buildAnalytics(data: SerializedBehaviorClusteringResult): Promise<BuilderBehaviorClusteringResult> {
    // Build the table.

    // 1. Find the Customer to ID pairing.
    // 2. Map the Customer to the tables.
    // Go through the data
    const allTables: Record<string, { name: string; id: string; email: string }[]> = {};
    for (const [featureName, customerRecords] of Object.entries(data)) {
      const table: { name: string; id: string; email: string }[] = [];
      for (const row of customerRecords) {
        const customer = await Customer.findById(row.customerId).lean();
        if (customer){
          table.push({
            name: customer.name,
            id: customer?.id,            
            email: customer?.email,
          });          
        }
      }
      allTables[featureName] = table
    }

    return {
      spendHighTable: allTables['spendHigh'] ?? [],
      spendNormalTable: allTables['spendNormal'] ?? [],
      spendLowTable: allTables['spendLow'] ?? [],
      frequencyHighTable: allTables['frequencyHigh'] ?? [],
      frequencyNormalTable: allTables['frequencyNormal'] ?? [],
      frequencyLowTable: allTables['frequencyLow'] ?? [],
      recencyHighTable: allTables['recencyHigh'] ?? [],
      recencyNormalTable: allTables['recencyNormal'] ?? [],
      recencyLowTable: allTables['recencyLow'] ?? [],
    };
  };
};