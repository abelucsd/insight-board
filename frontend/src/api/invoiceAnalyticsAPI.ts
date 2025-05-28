import axios from 'axios';
import { API_URL } from "../utils/data";
import { TopProducts, MonthlyData, CurrMonthData } from '../types/invoiceAnalytics';


interface RawTopProduct {
  itemName: string;
  quantitySold: number;
};

export const getTopProducts = async (): Promise<TopProducts[]> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/top-products`
  );

  const cleanedData: TopProducts[] = response.data.data.map(
    (row: RawTopProduct) => ({
      "Item Name": row.itemName,
      "Quantity Sold": row.quantitySold
    })
  );  
  
  return cleanedData;
};

export const getMonthlySales = async (): Promise<MonthlyData[]> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/monthly-sales`
  );
  
  return response.data.data;
};

export const getCurrMonthSales = async (): Promise<CurrMonthData> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/current-month-sales`
  );  
  
  return response.data.data;
};

export const getMonthlyRevenue = async (): Promise<MonthlyData[]> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/monthly-revenue`
  );
  
  return response.data.data;
}; 

export const getCurrMonthRevenue = async (): Promise<CurrMonthData> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/current-month-revenue`
  );
  return response.data.data;
}; 

export const getMonthlyProfit = async (): Promise<MonthlyData[]> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/monthly-profit`
  );
  return response.data.data;
};