import { IInvoice } from "../../models/invoice";
import { TopAttributeData } from "./analyticsTypes";

export interface TopStrategy {
  findTopByAttribute(data: IInvoice[]): TopAttributeData[];
};

export class TopProductsStrategy implements TopStrategy {
  public findTopByAttribute(data: IInvoice[]): TopAttributeData[] {
    // map
    const attributeMap: {[itemName: string]: number} = {};

    data.forEach(row => {
      attributeMap[row.itemName] = (attributeMap[row.itemName] || 0) + 
      row.quantity;
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