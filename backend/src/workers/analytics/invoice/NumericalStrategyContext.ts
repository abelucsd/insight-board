import { NumericalSumStrategy } from "./NumericalSumStrategy"
import { IInvoice } from "../../../models/invoice";

export class NumericalSumStrategyContext {
  private strategy: NumericalSumStrategy;
  private data: IInvoice[];

  constructor(strategy: NumericalSumStrategy, data: IInvoice[]) {
    this.strategy = strategy;    
    this.data = data;
  };

  public setStrategy(strategy: NumericalSumStrategy) {
    this.strategy = strategy;
  };

  public setData(data: IInvoice[]) {
    this.data = data;
  };

  public sumNumericalData(): number {
    // TODO: change return type to number.    
    return this.strategy.sumNumericalData(this.data);
  };
};