import { QueryFunctionContext } from '@tanstack/react-query';
import { BehaviorClusterCustomers } from '../types/customerTrends';
import apiClient from './apiClient';



// Customer tables grouped by an attribute
export const getHighSpenderCustomers = async (
  { queryKey }: QueryFunctionContext<[string, string, number, number, string]>)
  : Promise<{ table: BehaviorClusterCustomers; total: number }> => {
  const [, pageIndex, pageSize, searchQuery] = queryKey;
  const response = await apiClient.get('/analytics?behavior=high-spender', {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      search: searchQuery,
    }
  })
  
  return response.data;
};

export const getNormalSpenderCustomers = async (
  { queryKey }: QueryFunctionContext<[string, string, number, number, string]>)
  : Promise<{ table: BehaviorClusterCustomers; total: number }> => {
  const [, pageIndex, pageSize, searchQuery] = queryKey;
  const response = await apiClient.get('/analytics?behavior=normal-spender', {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      search: searchQuery,
    }
  })
  
  return response.data;
};

export const getLowSpenderCustomers = async (
  { queryKey }: QueryFunctionContext<[string, string, number, number, string]>)
  : Promise<{ table: BehaviorClusterCustomers; total: number }> => {
  const [, pageIndex, pageSize, searchQuery] = queryKey;
  const response = await apiClient.get('/analytics?behavior=low-spender', {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      search: searchQuery,
    }
  })
  
  return response.data;
};

export const getHighRecencyCustomers = async (
  { queryKey }: QueryFunctionContext<[string, string, number, number, string]>)
  : Promise<{ table: BehaviorClusterCustomers; total: number }> => {
  const [, pageIndex, pageSize, searchQuery] = queryKey;
  const response = await apiClient.get('/analytics?behavior=high-recency', {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      search: searchQuery,
    }
  })
  
  return response.data;
};

export const getNormalRecencyCustomers = async (
  { queryKey }: QueryFunctionContext<[string, string, number, number, string]>)
  : Promise<{ table: BehaviorClusterCustomers; total: number }> => {
  const [, pageIndex, pageSize, searchQuery] = queryKey;
  const response = await apiClient.get('/analytics?behavior=normal-recency', {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      search: searchQuery,
    }
  })
  
  return response.data;
};

export const getLowRecencyCustomers = async (
  { queryKey }: QueryFunctionContext<[string, string, number, number, string]>)
  : Promise<{ table: BehaviorClusterCustomers; total: number }> => {
  const [, pageIndex, pageSize, searchQuery] = queryKey;
  const response = await apiClient.get('/analytics?behavior=low-recency', {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      search: searchQuery,
    }
  })
  
  return response.data;
};

export const getHighFrequencyCustomers = async (
  { queryKey }: QueryFunctionContext<[string, string, number, number, string]>)
  : Promise<{ table: BehaviorClusterCustomers; total: number }> => {
  const [, pageIndex, pageSize, searchQuery] = queryKey;
  const response = await apiClient.get('/analytics?behavior=high-frequency', {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      search: searchQuery,
    }
  })
  
  return response.data;
};

export const getNormalFrequencyCustomers = async (
  { queryKey }: QueryFunctionContext<[string, string, number, number, string]>)
  : Promise<{ table: BehaviorClusterCustomers; total: number }> => {
  const [, pageIndex, pageSize, searchQuery] = queryKey;
  const response = await apiClient.get('/analytics?behavior=normal-frequency', {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      search: searchQuery,
    }
  })
  
  return response.data;
};

export const getLowFrequencyCustomers = async (
  { queryKey }: QueryFunctionContext<[string, string, number, number, string]>)
  : Promise<{ table: BehaviorClusterCustomers; total: number }> => {
  const [, pageIndex, pageSize, searchQuery] = queryKey;
  const response = await apiClient.get('/analytics?behavior=low-frequency', {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      search: searchQuery,
    }
  })
  
  return response.data;
};