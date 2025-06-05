import axios from 'axios';
import { API_URL } from "../utils/data";
import { TopProducts, MonthlyData, CurrMonthData, TopLocations } from '../types/invoiceAnalytics';


interface RawTopData {
  attribute: string;
  count: number;
};

interface RawTopProduct {
  itemName: string;
  quantitySold: number;
};

export const getTopProducts = async (): Promise<TopProducts[]> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/top-products`
  );

  console.log(response.data.data)

  const cleanedData: TopProducts[] = response.data.data.map(
    (row: RawTopData) => ({
      "Item Name": row.attribute,
      "Quantity Sold": row.count
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

export const getCurrMonthProfit = async (): Promise<CurrMonthData> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/current-month-profit`
  );
  return response.data.data;
}; 

export const getTopLocationsBySales = async (): Promise<TopLocations[]> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/top-locations-by-sales`
  );

  const cleanedData: TopLocations[] = response.data.data.map(
    (row: RawTopData) => ({
      "Location": row.attribute,
      "Sales": row.count
    })
  );
  return cleanedData;
}; 