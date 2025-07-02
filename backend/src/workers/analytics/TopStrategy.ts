import { IInvoice } from "../../models/invoice";
import { TopAttributeData } from "./analyticsTypes";

export interface TopStrategy {
  findTopByAttribute(data: IInvoice[]): TopAttributeData[];
};

/**
 * 
 */
export class TopProductsStrategy implements TopStrategy {
  public findTopByAttribute(data: IInvoice[]): TopAttributeData[] {
    // map
    const attributeMap: {[name: string]: number} = {};

    // create a dictionary key per item found.
    // sum each item's quantity sold.
    data.forEach(row => {
      row.items.forEach(item => {
        attributeMap[item.name] = (attributeMap[item.name] || 0) +
        item.quantity;
      })      
    });
    return getTopByAttributeFromMap(attributeMap, 10);
  }
};

export class TopLocationsBySalesStrategy implements TopStrategy {
  public findTopByAttribute(data: IInvoice[]): TopAttributeData[] {
    // map
    const attributeMap: {[locations: string]: number} = {};

    data.forEach(row => {
      attributeMap[row.location] = (attributeMap[row.location] || 0) + 
      1;
    });
    return getTopByAttributeFromMap(attributeMap, 10);
  }
};

const getTopByAttributeFromMap = (attributeMap: {[key: string]: number}, limit: number, ): TopAttributeData[] => {
  const entries = Object.entries(attributeMap);
  const sortedEntries = entries.sort((a, b) => b[1] - a[1]);

  return sortedEntries.slice(0, limit)
    .map(([attribute, count]) => ({
      attribute,
      count
    })
  );
};