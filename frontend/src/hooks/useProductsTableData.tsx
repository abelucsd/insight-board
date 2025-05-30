import '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import {
  getProducts
} from '../api/productsTableAPI';
import { Product } from '../types/products';
import { useState } from 'react';

const defaultProductsData: Product[] = [];

export const useProductsTableData = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', pageIndex, pageSize, searchQuery],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 60 * 24 * 30,
    refetchInterval: false,
    placeholderData: (previousData, previousQuery) => previousData,
  });

  // const isLoading = productsQuery.isLoading;

  // const isError = productsQuery.isError;

  return {
    products: data?.data ?? defaultProductsData,
    total: data?.total ?? 0,
    isLoading,
    isError,
    pageIndex,
    pageSize,
    searchQuery,
    setPageIndex,
    setPageSize,
    setSearchQuery,
  };
};

