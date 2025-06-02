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
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);


  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', pageIndex, pageSize, searchQuery],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 60 * 24 * 30,
    refetchInterval: false,
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation<string, Error, string>({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
          predicate: query => query.queryKey[0] === 'products',
      });
      alert('Product deleted successfully');
    },
    onError: (error) => {
      alert(error.message);
    },        
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleOpenConfirm = (id: string) => {
    setSelectedProductId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProductId) {
      handleDelete(selectedProductId); // your mutation call
    }
    setDialogOpen(false);
    setSelectedProductId(null);
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
    setSelectedProductId(null);
  };



  return {
    products: data?.data ?? defaultProductsData,
    total: data?.total ?? 0,
    isLoading,
    isError,
    pageIndex,
    pageSize,
    searchQuery,
    isDialogOpen,
    selectedProductId,
    setPageIndex,
    setPageSize,
    setSearchQuery,
    handleDelete,
    handleOpenConfirm,
    handleConfirmDelete,
    handleCancelDelete,
  };
};