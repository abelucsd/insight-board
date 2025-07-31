import { ClusteringResult } from "./types";
import { SerializedBehaviorClusteringResult } from "./customerStrategyReturnTypes";
import { Customer } from '../../../models/customer';
import { BuilderBehaviorClusteringResult } from './customerStrategyReturnTypes';
import { createLogger } from "../../../utils/logger";

const logger = createLogger(`CustomerAnalyticsBuilderStrategy`);

export interface CustomerAnalyticsBuilderStrategy {
  buildAnalytics(data: SerializedBehaviorClusteringResult): Promise<BuilderBehaviorClusteringResult>;
};

/**
 * Should expected serialized data in the form of key value pairs.
 */
export class CustomerBehaviorClusteringAnalyticsBuilderStrategy implements CustomerAnalyticsBuilderStrategy {
  public async buildAnalytics(data: SerializedBehaviorClusteringResult): Promise<BuilderBehaviorClusteringResult> {
    logger.info(`[buildAnalytics] Building the analytics table.`)
    // Build the table.

    // 1. Find the Customer to ID pairing.
    // 2. Map the Customer to the tables.
    // Go through the data
    const allTables: Record<string, { name: string; id: string; email: string }[]> = {};
    for (const [featureName, customerRecords] of Object.entries(data)) {
      const table: { name: string; id: string; email: string }[] = [];
      for (const row of customerRecords) {
        const customer = await Customer.findOne({id: row.customerId}).lean();
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

    logger.info(`[buildAnalytics] Done building the table.`)

    return {
      spendHigh: allTables['spendHigh'] ?? [],
      spendNormal: allTables['spendNormal'] ?? [],
      spendLow: allTables['spendLow'] ?? [],
      frequencyHigh: allTables['frequencyHigh'] ?? [],
      frequencyNormal: allTables['frequencyNormal'] ?? [],
      frequencyLow: allTables['frequencyLow'] ?? [],
      recencyHigh: allTables['recencyHigh'] ?? [],
      recencyNormal: allTables['recencyNormal'] ?? [],
      recencyLow: allTables['recencyLow'] ?? [],
    };
  };
};