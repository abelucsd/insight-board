import '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInvoices,
  deleteInvoice,  
} from '../api/invoiceTableAPI';
import { Invoice } from '../types/invoice';
import { useState } from 'react';

const defaultInvoicesData: Invoice[] = [];

export const useInvoicesTableData = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');  
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  


  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['invoices', pageIndex, pageSize, searchQuery],
    queryFn: getInvoices,
    staleTime: 1000 * 60 * 60 * 24 * 30,
    refetchInterval: false,
    placeholderData: (previousData) => previousData,
  });  

  const deleteMutation = useMutation<string, Error, string>({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({
          predicate: query => query.queryKey[0] === 'invoices',
      });
      alert('invoice deleted successfully');
    },
    onError: (error) => {
      alert(error.message);
    },        
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleOpenConfirm = (id: string) => {
    setSelectedInvoiceId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedInvoiceId) {
      handleDelete(selectedInvoiceId); // your mutation call
    }
    setDialogOpen(false);
    setSelectedInvoiceId(null);
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
    setSelectedInvoiceId(null);
  };



  return {
    invoices: data?.data ?? defaultInvoicesData,
    total: data?.total ?? 0,
    isLoading,
    isError,
    pageIndex,
    pageSize,
    searchQuery,    
    isDialogOpen,
    selectedInvoiceId,
    setPageIndex,
    setPageSize,
    setSearchQuery,    
    handleDelete,
    handleOpenConfirm,
    handleConfirmDelete,
    handleCancelDelete,    
  };
};