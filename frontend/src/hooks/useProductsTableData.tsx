import '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import {
  getProducts
} from '../api/productsTableAPI';
import { Product } from '../types/products';

const defaultProductsData: Product[] = [];

export const useProductsTableData = () => {
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 60 * 24 * 30,
    refetchInterval: false
  });

  const isLoading = productsQuery.isLoading;

  const isError = productsQuery.isError;

  return {
    products: productsQuery.data ?? defaultProductsData,
  };
};

