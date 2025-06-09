import apiClient from './apiClient';
import { API_URL } from "../utils/data";
import { VisitResponse } from '../types/visitAnalytics';
import { CurrMonthData } from '../types/visitAnalytics';

export const postVisit = async (timestamp: Date): Promise<VisitResponse> => {
  const response = await apiClient.post(
    `${API_URL}/visit/analytics`, {
      timestamp
    }
  );
  return response.data;
};

export const getVisits = async (): Promise<number> => {
  const response = await apiClient.get(
    `${API_URL}/visit/analytics`
  );
    
  return response.data.data;
};

export const getCurrentMonthVisits = async (): Promise<CurrMonthData> => {
  const response = await apiClient.get(
    `${API_URL}/visit/analytics/current-month-visits`
  );
  console.log(response.data)
  return response.data.data;
};