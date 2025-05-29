import axios from 'axios';
import { QueryFunctionContext } from '@tanstack/react-query';
import { API_URL } from '../utils/data';
import { Product } from '../types/products';

export const getProducts = async ({ queryKey }: QueryFunctionContext<[string, number, number]> ) 
  : Promise<{ data: Product[]; total: number }> => {
    
  const [, pageIndex, pageSize] = queryKey;

  const response = await axios.get(
    `${API_URL}/products/`, {
      params: {
        page: pageIndex + 1,
        limit: pageSize
      },
    }
  );
  
  return response.data;
};