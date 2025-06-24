/**
 * NOTE: Visit KPI analysis is handled here temporarily to avoid 
 * creating a full analytics layer for a single use case.
 * If more Visit analyses are added in the future, extract into its own module.
 */


import { createLogger } from "../../utils/logger";
import { CustomError } from "../../errors/CustomError";
import { IInvoice, Invoice } from "../../models/invoice";
import { NumericalSumStrategyContext } from "./NumericalStrategyContext";
import { NumericalSumStrategy, SumProfitStrategy, SumRevenueStrategy, SumInvoicesStrategy } from "./NumericalSumStrategy";
import { TopStrategyContext } from "./TopStrategyContext";
import { TopLocationsBySalesStrategy, TopProductsStrategy, TopStrategy } from "./TopStrategy";

import { MonthlyData, CurrentMonthGrowthData, TopAttributeData } from "./analyticsTypes";

import { 
  filterByMonth,
  growthLossCalculator,
  getCurrAndPastMonthLabels,
  getNumericalSumCurrAndPastMonth,
  getYearRange,
  filterByMonthAndYear,
 } from "./helpers";
import { getDb } from "../../db/db";
import mongoose from "mongoose";
import { IVisit, Visit } from "../../models/visit";


// Currently O(N^2) through the rows.
// TODO: refactor to be quicker.
// Uses a strategy pattern.

const logger = createLogger('handleAnalyticsJob.ts');


const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];


export const getTopByAttribute = async (attribute: string): Promise<TopAttributeData[]> => {
  let invoiceData: IInvoice[] = [];
  try {
    invoiceData = await Invoice.find({});
  } catch (error) {
    const err = new CustomError(`${error}`, 500);
    throw(err);
  }

  let strategy;
  switch(attribute) {
    case 'products':
      strategy = new TopProductsStrategy();
      break;
    case 'locationsBySales':
      strategy = new TopLocationsBySalesStrategy();      
      break;
    default:
      const error = new CustomError(
        'Unhandled attribute type for getTopByAttribute.',
        400
      );
      throw error;
  };

  const topStrategyCtx = new TopStrategyContext(
    strategy!,
    []
  );

  topStrategyCtx.setData(invoiceData);

  return topStrategyCtx.findTopByAttribute();
};



export const getMonthlyData = async (
  category: string
): Promise<MonthlyData[] | null> => {        

  // prepare the Strategy pattern
  let strategy;
  switch(category) {
    case 'invoices':
      strategy = new SumInvoicesStrategy();
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
  };
  
  const numericalSumCtx = new NumericalSumStrategyContext(
    strategy!,
    []
  );

  // prepare the data
  let invoiceData: IInvoice[] = [];
  try {
    invoiceData = await Invoice.find({});
  } catch (error) {
    const err = new CustomError(`${error}`, 500);
    throw(err);
  }

  // load the data into returned array
  const data: MonthlyData[] = [];
  
  const earliestDate = await Invoice.findOne().sort({date: 1}).lean();
  const now = new Date();
  const yearsRange = getYearRange(new Date(earliestDate!.date), now);
  
  yearsRange.forEach((year) => {
    for (let month = 0; month < 12; month++) {
      let monthRecords = filterByMonthAndYear(invoiceData, month, year)
      numericalSumCtx.setData(monthRecords);
      const total = numericalSumCtx.sumNumericalData();
      data.push({ year: year.toString(), month: MONTHS[month], total: total });
    };
  });

  return data;
};

export const getCurrMonthData= async (
  category: string
): Promise<CurrentMonthGrowthData> => {
  const invoiceData = await Invoice.find({});
  let strategy;
  switch(category) {
    case 'invoices':
      strategy = new SumInvoicesStrategy();
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
) : Promise<MonthlyData[] | CurrentMonthGrowthData | TopAttributeData[] | null> {
  let result: MonthlyData[] | CurrentMonthGrowthData | TopAttributeData[] | Error | null = [];

  logger.info(`[getAnalytics] Handle ${analyticsType}.`)

  await getDb();

  switch (analyticsType) {
    case 'topProducts':
      result = await getTopByAttribute('products');      
      break;
    case 'monthlyInvoices':
      result = await getMonthlyData('invoices');
      break;
    case 'currentMonthInvoices':
      result = await getCurrMonthData('invoices');
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
    case 'topLocationsBySales':
      result = await getTopByAttribute('locationsBySales');      
      break;
    case 'currVisits':
      result = await getCurrVisitData();
      break;
    default:
      const error = new CustomError('Unhandled analytics type.', 400);
      throw error;
  }
  
  logger.info(`[getAnalytics] Successful transformation for ${analyticsType}.`)

  await mongoose.disconnect();

  return result;
};



// -----------------------------------------------
// TEMPORARY: Visit KPI Analysis (Single Use Case)
// -----------------------------------------------
export async function getCurrVisitData(): Promise<Promise<CurrentMonthGrowthData>> {  
  const data : IVisit[] = await Visit.find({});
  const {currMonth, pastMonth} = getCurrAndPastMonthLabels();

  // filter by month
  const currRecords = data.filter((record) => new Date(record.timestamp).getMonth() === currMonth);
  const pastRecords = data.filter((record) => new Date(record.timestamp).getMonth() === pastMonth);


  let result = data
    .reduce((sum, record) => sum + Number(record.timestamp), 0); 
  result = Math.round(result * 100) / 100;

  const reduceData = (records: IVisit[]) => records.length;    

  const round2 = (num: number) => Math.round(num * 100) / 100;

  const reducedCurrRecords = reduceData(currRecords);
  const reducedPastRecords = reduceData(pastRecords);
  const currMonthSum = round2(reducedCurrRecords);
  const prevMonthSum = round2(reducedPastRecords);

 let growthLoss = growthLossCalculator(currMonthSum, prevMonthSum);
  if (Number.isNaN(growthLoss) || growthLoss == Infinity) {
    growthLoss = 0;
  }  

  return {total: currMonthSum, growth: growthLoss}; 
};