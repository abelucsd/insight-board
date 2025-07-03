import '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCustomers,
  deleteCustomer,
  updateCustomer
} from '../api/customerAPI';
import { Customer } from '../types/customer';
import { useState } from 'react';

const defaultCustomersData: Customer[] = [];

export const useCustomersTableData = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');  
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  


  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['customers', pageIndex, pageSize, searchQuery],
    queryFn: getCustomers,
    staleTime: 1000 * 60 * 60 * 24 * 30,
    refetchInterval: false,
    placeholderData: (previousData) => previousData,
  });

  const updateMutation = useMutation<string, Error, { id: string; updatedCustomer: Partial<Customer> }>({
      mutationFn: updateCustomer,
      onSuccess: () => {
        queryClient.invalidateQueries({
            predicate: query => query.queryKey[0] === 'customers',
        });
      },
      onError: (error) => {
        alert(error.message);
      }
    });

  const handleUpdate = (id: string, updatedCustomer: Partial<Customer>) => {
    updateMutation.mutate({id, updatedCustomer});
  };

  const handleOpenEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsUpdateOpen(true);
  };
  
  const handleCloseEdit = () => {
    setIsUpdateOpen(false);
    setSelectedCustomer(null);
  };

  const deleteMutation = useMutation<string, Error, string>({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({
          predicate: query => query.queryKey[0] === 'customers',
      });
      alert('customer deleted successfully');
    },
    onError: (error) => {
      alert(error.message);
    },        
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleOpenConfirm = (id: string) => {
    setSelectedCustomerId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCustomerId) {
      handleDelete(selectedCustomerId); // your mutation call
    }
    setDialogOpen(false);
    setSelectedCustomerId(null);
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
    setSelectedCustomerId(null);
  };



  return {
    customers: data?.data ?? defaultCustomersData,
    total: data?.total ?? 0,
    isLoading,
    isError,
    pageIndex,
    pageSize,
    searchQuery,    
    isDialogOpen,
    selectedCustomerId,
    setPageIndex,
    setPageSize,
    setSearchQuery,  
    handleOpenEdit,
    handleCloseEdit,
    handleUpdate,
    isUpdateOpen,
    selectedCustomer,
    handleDelete,
    handleOpenConfirm,
    handleConfirmDelete,
    handleCancelDelete,    
  };
};