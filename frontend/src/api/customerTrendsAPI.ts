import { QueryFunctionContext } from '@tanstack/react-query';
import { BehaviorClusterCustomers } from '../types/customerTrends';
import apiClient from './apiClient';



// Customer tables grouped by an attribute
export const getCustomerTrendAnalytics = async (
  { queryKey }: QueryFunctionContext<[string, string, number, number, string]>)
  : Promise<BehaviorClusterCustomers> => {
  const [behavior, filterType, pageIndex, pageSize, searchQuery] = queryKey;
  const response = await apiClient.get(`/analytics/customer-trends?analysis=${behavior}&filter=${filterType}`, {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      search: searchQuery,
    }
  })
  
  return response.data;
};