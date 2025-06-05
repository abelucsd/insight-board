import apiClient from './apiClient';
import { API_URL } from "../utils/data";
import { VisitResponse } from '../types/visitAnalytics';

export const postVisit = async (timestamp: Date): Promise<VisitResponse> => {
  const response = await apiClient.post(
    `${API_URL}/invoice/analytics/monthly-sales`, {
      timestamp
    }
  );
  return response.data;
};