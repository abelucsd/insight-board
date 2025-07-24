import { TopStrategy } from "./TopStrategy";
import { IInvoice } from "../../../models/invoice";
import { TopAttributeData } from "./analyticsTypes";

export class TopStrategyContext {
  private strategy: TopStrategy;
  private data: IInvoice[];

  constructor(strategy: TopStrategy, data: IInvoice[]) {
    this.strategy = strategy;
    this.data = data;
  };

  public setStrategy(strategy: TopStrategy) {
    this.strategy = strategy;
  };

  public setData(data: IInvoice[]) {
    this.data = data;
  };

  public findTopByAttribute(): TopAttributeData[] {
    return this.strategy.findTopByAttribute(this.data);
  };
};