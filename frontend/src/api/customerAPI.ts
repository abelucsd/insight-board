import { QueryFunctionContext } from '@tanstack/react-query';
import { Customer } from '../types/customer';
import apiClient from './apiClient';

export const getCustomers = async ({ queryKey }: QueryFunctionContext<[string, number, number, string]> ) 
  : Promise<{ data: Customer[]; total: number }> => {
    
  const [, pageIndex, pageSize, searchQuery] = queryKey;

  const response = await apiClient.get('/customer/', {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      search: searchQuery,
    },
  });
  
  return response.data;
};


export const deleteCustomer = async(id: string): Promise<string> => {
  const response = await apiClient.delete(`/customer/${id}`);

  return response.data?.message ?? 'Deleted successfully';
};

export const updateCustomer = async ({id, updatedCustomer,}: {id: string, updatedCustomer: Partial<Customer>}): Promise<string> => {
  const response = await apiClient.put(`/customer/${id}`, updatedCustomer);

  return response.data?.message ?? 'Updated successfully';
};