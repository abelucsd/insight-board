import axios from 'axios';
import { API_URL } from "../utils/data";

export interface TopProducts {
  itemName: string;
  quantitySold: number;
};

export interface MonthlyData {
  total: number;
  month: string;
};

export interface CurrMonthData {
  total: number;
  growth: number;
};

export const getTopProducts = async (): Promise<TopProducts[]> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/top-products`
  );
  return response.data.message;
}

export const getMonthlySales = async (): Promise<MonthlyData[]> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/monthly-sales`
  );
  return response.data.message;
};

export const getCurrMonthSales = async (): Promise<CurrMonthData> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/current-month-sales`
  );  
  return response.data.message;
};

export const getMonthlyRevenue = async (): Promise<MonthlyData[]> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/monthly-revenue`
  );
  return response.data.message;
}; 

export const getCurrMonthRevenue = async (): Promise<CurrMonthData> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/current-month-revenue`
  );
  return response.data.message;
}; 

export const getMonthlyProfit = async (): Promise<MonthlyData[]> => {
  const response = await axios.get(
    `${API_URL}/invoice/analytics/monthly-profit`
  );
  return response.data.message;
}; 

// TODO:
// export const getCurrMonthProfit = async (): Promise<CurrMonthData> => {
//   const response = await axios.get(
//     `${API_URL}/invoice/analytics/current-month-profit`
//   );
//   return response.data.message;
// }; 

// export const getTopLocations = async () => axios.get(
//   `${API_URL}/invoice/analytics/top-locations`
// );