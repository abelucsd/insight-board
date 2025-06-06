import { QueryFunctionContext } from '@tanstack/react-query';
import { Invoice } from '../types/invoice';
import apiClient from './apiClient';

export const getInvoices = async ({ queryKey }: QueryFunctionContext<[string, number, number, string]> ) 
  : Promise<{ data: Invoice[]; total: number }> => {
    
  const [, pageIndex, pageSize, searchQuery] = queryKey;

  const response = await apiClient.get('/invoice/', {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      search: searchQuery,
    },
  });
  
  return response.data.data;
};


export const deleteInvoice = async(id: string): Promise<string> => {
  const response = await apiClient.delete(`/invoice/${id}`);

  return response.data?.message ?? 'Deleted successfully';
};