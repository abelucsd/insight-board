import '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProducts,
  deleteProduct
} from '../api/productsTableAPI';
import { Product } from '../types/products';
import { useState } from 'react';

const defaultProductsData: Product[] = [];

export const useProductsTableData = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', pageIndex, pageSize, searchQuery],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 60 * 24 * 30,
    refetchInterval: false,
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteProduct,
    onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: query => query.queryKey[0] === 'products',
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };
  

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
    handleDelete,
  };
};

