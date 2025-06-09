import { IInvoice } from "../../models/invoice";
import { NumericalSumStrategy } from "./NumericalSumStrategy";
import { NumericalSumStrategyContext } from "./NumericalStrategyContext";


// TODO: refactor filterering by month logic.
export const filterByMonth = (
  records: IInvoice[], month: number
): IInvoice[] => {
  return records.filter((record) => new Date(record.date).getMonth() === month);
};

export const growthLossCalculator = (currAmount: number, pastAmount: number): number => {    
  let growth = currAmount / pastAmount;
  if (growth < 1) {
    growth = 1. - growth;
  } else {
    growth = growth - 1.;
  }
  growth *= 100;
  return parseFloat(growth.toFixed(2));
};


export const getCurrAndPastMonthLabels = (): {currMonth: number, pastMonth: number} => {
  const currMonth = new Date().getMonth();
  let pastMonth = currMonth - 1;
  if (currMonth === 0) {
    pastMonth = 12;
  } else {
    pastMonth = currMonth - 1;
  } 
  return {currMonth, pastMonth}
};

// coupled to invoice
export const getNumericalSumCurrAndPastMonth = (
  records: IInvoice[],
  strategy: NumericalSumStrategy
) => {
  const {currMonth, pastMonth} = getCurrAndPastMonthLabels();
  const recordsCurrMonth = filterByMonth(records, currMonth);
  const recordsPrevMonth = filterByMonth(records, pastMonth);

  const currMonthCtx = new NumericalSumStrategyContext(
    strategy,
    recordsCurrMonth
  );
  const prevMonthCtx = new NumericalSumStrategyContext(
    strategy,
    recordsPrevMonth
  );

  const currMonthSum = currMonthCtx.sumNumericalData();
  const prevMonthSum = prevMonthCtx.sumNumericalData();

  return {currMonthSum, prevMonthSum};
};