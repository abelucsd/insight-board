import { QueryFunctionContext } from '@tanstack/react-query';
import { Product } from '../types/products';
import apiClient from './apiClient';

export const getProducts = async ({ queryKey }: QueryFunctionContext<[string, number, number, string]> ) 
  : Promise<{ data: Product[]; total: number }> => {
    
  const [, pageIndex, pageSize, searchQuery] = queryKey;

  const response = await apiClient.get('/products/', {
    params: {
      page: pageIndex + 1,
      limit: pageSize,
      search: searchQuery,
    },
  });
  
  return response.data;
};

export async function deleteProduct(id: string): Promise<string> {
  const response = await apiClient.delete(`/products/${id}`);

  return response.data?.message ?? 'Deleted successfully';
};