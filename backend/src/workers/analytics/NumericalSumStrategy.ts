import { IInvoice, Invoice } from "../../models/invoice";

const round2 = (num: number) => Math.round(num * 100) / 100;

export interface NumericalSumStrategy {
  sumNumericalData(data: IInvoice[]): number;
};

export class SumRevenueStrategy implements NumericalSumStrategy {
  public sumNumericalData(data: IInvoice[]): number {
    const result = data
    .reduce((sum, record) => sum + Number(record.revenue), 0);    

    return round2(result);
  };
};

export class SumCostStrategy implements NumericalSumStrategy {
  public sumNumericalData(data: IInvoice[]): number {
    const result = data
    .reduce((sum, record) => sum + Number(record.cost), 0);    

    return round2(result)
  };
};

export class SumProfitStrategy implements NumericalSumStrategy {
  public sumNumericalData(data: IInvoice[]): number {
    const revenue = data
      .reduce((sum, record) => sum + Number(record.revenue), 0);    
    const cost = data
      .reduce((sum, record) => sum + Number(record.cost), 0);

    const result =  revenue - cost;

    return round2(result);
  };
};

export class SumCustomersStrategy implements NumericalSumStrategy {
  public sumNumericalData(data: IInvoice[]): number {
    return data.length;    
  };
};

export class SumInvoicesStrategy implements NumericalSumStrategy {
  public sumNumericalData(data: IInvoice[]): number {
    return data.length;
  };
};