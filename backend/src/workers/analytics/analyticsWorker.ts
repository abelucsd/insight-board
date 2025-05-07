import { createLogger } from "../../utils/logger";
import { CustomError } from "../../errors/CustomError";
import { IInvoice, Invoice } from "../../models/invoice";
import { NumericalSumStrategyContext } from "./NumericalStrategyContext";
import { NumericalSumStrategy, SumProfitStrategy, SumRevenueStrategy, SumSalesStrategy } from "./NumericalSumStrategy";

import { 
  filterByMonth,
  growthLossCalculator,
  getCurrAndPastMonthLabels,
  getNumericalSumCurrAndPastMonth,
 } from "./helpers";
import { getDb } from "../../db/db";
import mongoose from "mongoose";


// Currently O(N^2) through the rows.
// TODO: refactor to be quicker.
// Uses a strategy pattern.

const logger = createLogger('analyticsWorker.ts');

interface MonthlyData {
  month: string, 
  total: number
};

interface CurrentMonthGrowthData {
  total: number,
  growth: number;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];


export const getTopProducts = async (): Promise<any[]> => {
  // find many
  const invoiceData = await Invoice.find({});
  
  // O(N) - N rows  
  // use a hashmap  
  const productsSold: { [itemName: string]: number } = {};
  
  invoiceData.forEach(row => {
    productsSold[row.itemName] = (productsSold[row.itemName] || 0) + 
      row.quantity;    
  });

  // sort the products in descending order
  const entries = Object.entries(productsSold);
  const sortedProducts = entries.sort((a, b) => a[1] - b[1]);

  const topProducts = sortedProducts.slice(0, 10)
    .map(([itemName, quantitySold]) => ({
      itemName,
      quantitySold
  }));
    
  return topProducts;
};


export const getMonthlyData = async (
  category: string
): Promise<MonthlyData[] | null> => {        
  let strategy;
  switch(category) {
    case 'sales':
      strategy = new SumSalesStrategy();
      break;
    case 'revenue':
      strategy = new SumRevenueStrategy();
      break;
    case 'profit':
      strategy = new SumProfitStrategy();
      break;
    default:
      const error = new CustomError(
        'Unhandled category type for getMonthlyData.', 
        400
      );
      throw error;
  }    
  
  const numericalSumCtx = new NumericalSumStrategyContext(
    strategy!,
    []
  );

  let invoiceData: IInvoice[] = [];
  try {
    invoiceData = await Invoice.find({});
  } catch (error) {
    const err = new CustomError(`${error}`, 500);
    throw(err);
  }
  const data: MonthlyData[] = [];

  for (let i = 0; i < 12; i++) {
    let monthRecords = filterByMonth(invoiceData, i);
    numericalSumCtx.setData(monthRecords);
    const total = numericalSumCtx.sumNumericalData();
    data.push({ month: MONTHS[i], total: total });
  }
  
  return data;
};

export const getCurrMonthData= async (
  category: string
): Promise<CurrentMonthGrowthData> => {
  const invoiceData = await Invoice.find({});
  let strategy;
  switch(category) {
    case 'sales':
      strategy = new SumSalesStrategy();
      break;
    case 'revenue':
      strategy = new SumRevenueStrategy();
      break;
    case 'profit':
      strategy = new SumProfitStrategy();
      break;
    default:
      const error = new CustomError(`Unhandled category type.`, 400);
      throw error;
  };

  const {currMonthSum, prevMonthSum} = getNumericalSumCurrAndPastMonth(
    invoiceData,
    strategy!
  );  

  let growthLoss = growthLossCalculator(currMonthSum, prevMonthSum);
  if (Number.isNaN(growthLoss) || growthLoss == Infinity) {
    growthLoss = 0;
  }  

  return {total: currMonthSum, growth: growthLoss};
};


export async function getAnalytics(
  analyticsType: string
) : Promise<MonthlyData[] | CurrentMonthGrowthData | null> {
  let result: MonthlyData[] | CurrentMonthGrowthData | Error | null = [];

  logger.info(`[getAnalytics] Handle ${analyticsType}.`)

  await getDb();

  switch (analyticsType) {
    case 'topProducts':
      result = await getTopProducts();
      break;
    case 'monthlySales':
      result = await getMonthlyData('sales');
      break;
    case 'currentMonthSales':
      result = await getCurrMonthData('sales');
      break;
    case 'monthlyRevenue':
      result = await getMonthlyData('revenue');
      break;
    case 'currentMonthRevenue':
      result = await getCurrMonthData('revenue');
      break;
    case 'monthlyProfit':
      result = await getMonthlyData('profit');
      break;
    case 'currentMonthProfit':
      result = await getCurrMonthData('profit');
      break;
    default:
      const error = new CustomError('Unhandled analytics type.', 400);
      throw error;
  }

  logger.info(`Result: ${result}`)
  logger.info(`[getAnalytics] Successful transformation for ${analyticsType}.`)

  await mongoose.disconnect();

  return result;
};