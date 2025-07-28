// TODO: Load and Error states

import '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  getHighSpenderCustomers,
  getNormalSpenderCustomers,
  getLowSpenderCustomers,
  getHighRecencyCustomers,
  getNormalRecencyCustomers,
  getLowRecencyCustomers,
  getHighFrequencyCustomers,
  getNormalFrequencyCustomers,
  getLowFrequencyCustomers,
} from '../api/customerTrendsAPI';
import { CustomerTable, BehaviorType, LevelType } from '../types/customerTrends';


const defaultRevenueTable: CustomerTable = [];
const defaultRecencyTable: CustomerTable = [];
const defaultFrequencyTable: CustomerTable = [];


const usePaginatedSearch = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  return { pageIndex, setPageIndex, pageSize, setPageSize, searchQuery, setSearchQuery };
};

type TablesState = {
  revenue: CustomerTable | undefined;
  recency: CustomerTable | undefined;
  frequency: CustomerTable | undefined;
};
type TotalsState = {
  revenue: number;
  recency: number;
  frequency: number;
};
type LoadingState = {
  revenue: boolean;
  recency: boolean;
  frequency: boolean;
};
type ErrorState = {
  revenue: boolean;
  recency: boolean;
  frequency: boolean;
};

export const useCustomerTrendsData = () => { 
  const [tables, setTables] = useState<TablesState>({revenue: undefined, recency: undefined, frequency: undefined});
  const [totals, setTotals] = useState<TotalsState>({revenue: 0, recency: 0, frequency: 0});
  const [isLoadings, setIsLoadings] = useState<LoadingState>({revenue: false, recency: false, frequency: false});
  const [isErrors, setIsErrors] = useState<ErrorState>({revenue: false, recency: false, frequency: false});


  const behavior = 'customer-behavior';

  const revenue = usePaginatedSearch();
  const recency = usePaginatedSearch();
  const frequency = usePaginatedSearch();

  const queries = {
    revenue: {
      high: useQuery({queryKey: [behavior, 'high-spend', revenue.pageIndex, revenue.pageSize, revenue.searchQuery], queryFn: getHighSpenderCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
      normal: useQuery({queryKey: [behavior, 'normal-spend', revenue.pageIndex, revenue.pageSize, revenue.searchQuery], queryFn: getNormalSpenderCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),      
      low: useQuery({queryKey: [behavior, 'low-spend', revenue.pageIndex, revenue.pageSize, revenue.searchQuery], queryFn: getLowSpenderCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
    },
    recency: {
      high: useQuery({queryKey: [behavior, 'high-recency', recency.pageIndex, recency.pageSize, recency.searchQuery], queryFn: getHighRecencyCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
      normal: useQuery({queryKey: [behavior, 'normal-recency', recency.pageIndex, recency.pageSize, recency.searchQuery], queryFn: getNormalRecencyCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
      low: useQuery({queryKey: [behavior, 'low-recency', recency.pageIndex, recency.pageSize, recency.searchQuery], queryFn: getLowRecencyCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
    },
    frequency: {
      high: useQuery({queryKey: [behavior, 'high-frequency', frequency.pageIndex, frequency.pageSize, frequency.searchQuery], queryFn: getHighFrequencyCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
      normal: useQuery({queryKey: [behavior, 'normal-frequency', frequency.pageIndex, frequency.pageSize, frequency.searchQuery], queryFn: getNormalFrequencyCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
      low: useQuery({queryKey: [behavior, 'low-frequency', frequency.pageIndex, frequency.pageSize, frequency.searchQuery], queryFn: getLowFrequencyCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
    }
  }


  // Initialize table and total data.
  useEffect(() => {
    if (queries.revenue.high.data) {
      setTables(prev => ({ ...prev, revenue: queries.revenue.high.data!.customerTable}));
      setTotals(prev => ({ ...prev, revenue: queries.revenue.high.data!.total}));
    }
  }, [queries.revenue.high.data]);
  useEffect(() => {
    if (queries.recency.high.data) {
      setTables(prev => ({ ...prev, recency: queries.recency.high.data!.customerTable}));
      setTotals(prev => ({ ...prev, recency: queries.recency.high.data!.total}));
    }
  }, [queries.recency.high.data]);
  useEffect(() => {
    if (queries.frequency.high.data) {
      setTables(prev => ({ ...prev, frequency: queries.frequency.high.data!.customerTable}));
      setTotals(prev => ({ ...prev, frequency: queries.frequency.high.data!.total}));
    }
  }, [queries.frequency.high.data]);

  
  // Load and Error states
  useEffect(() => {
    const anyLoading = queries.revenue.high.isLoading || queries.revenue.normal.isLoading || queries.revenue.low.isLoading;
    setIsLoadings(prev => ({ ...prev, revenue: anyLoading}));   
  }, [queries.revenue.high.isLoading, queries.revenue.normal.isLoading, queries.revenue.low.isLoading]);
  useEffect(() => {
    const anyLoading = queries.recency.high.isLoading || queries.recency.normal.isLoading || queries.recency.low.isLoading;
    setIsLoadings(prev => ({ ...prev, recency: anyLoading}));
  }, [queries.recency.high.isLoading, queries.recency.normal.isLoading, queries.recency.low.isLoading]);
  useEffect(() => {
    const anyLoading = queries.frequency.high.isLoading || queries.frequency.normal.isLoading || queries.frequency.low.isLoading;
    setIsLoadings(prev => ({ ...prev, frequency: anyLoading}));
  }, [queries.frequency.high.isLoading, queries.frequency.normal.isLoading, queries.frequency.low.isLoading]);

  useEffect(() => {
    const anyError = queries.revenue.high.isError || queries.revenue.normal.isError || queries.revenue.low.isError;
    setIsErrors(prev => ({ ...prev, revenue: anyError}));
  }, [queries.revenue.high.isError, queries.revenue.normal.isError, queries.revenue.low.isError]);
  useEffect(() => {
    const anyError = queries.recency.high.isError || queries.recency.normal.isError || queries.recency.low.isError;
    setIsLoadings(prev => ({ ...prev, recency: anyError}));
  }, [queries.recency.high.isError, queries.recency.normal.isError, queries.recency.low.isError]);
  useEffect(() => {
    const anyError = queries.frequency.high.isError || queries.frequency.normal.isError || queries.frequency.low.isError;
    setIsLoadings(prev => ({ ...prev, frequency: anyError}));
  }, [queries.frequency.high.isError, queries.frequency.normal.isError, queries.frequency.low.isError]);


  // Event: On Filter  
  const handleLevelChange = (
    behavior: BehaviorType, levelFilter: LevelType) => {
    setTables(prev => ({ ...prev, [behavior]: queries[behavior][levelFilter].data!.customerTable}));
    setTotals(prev => ({ ...prev, [behavior]: queries[behavior][levelFilter].data!.total}));
  };


  /**
   * Flatten the object to return.   
   */
  return {
    revenue: {
      customerTable: tables.revenue ?? defaultRevenueTable,
      total: totals.revenue,
      pageIndex: revenue.pageIndex,
      pageSize: revenue.pageSize,
      searchQuery: revenue.searchQuery,
      setPageIndex: revenue.setPageIndex,
      setPageSize: revenue.setPageSize,
      setSearchQuery: revenue.setSearchQuery,
      isLoading: isLoadings.revenue,
      isError: isErrors.revenue,
    },
    recency: {
      customerTable: tables.recency ?? defaultRecencyTable,
      total: totals.recency,
      pageIndex: recency.pageIndex,
      pageSize: recency.pageSize,
      searchQuery: recency.searchQuery,
      setPageIndex: recency.setPageIndex,
      setPageSize: recency.setPageSize,
      setSearchQuery: recency.setSearchQuery,
      isLoading: isLoadings.recency,
      isError: isErrors.recency, 
    },
    frequency: {
      customerTable: tables.frequency ?? defaultFrequencyTable,
      total: totals.recency,
      pageIndex: frequency.pageIndex,
      pageSize: frequency.pageSize,
      searchQuery: frequency.searchQuery,
      setPageIndex: frequency.setPageIndex,
      setPageSize: frequency.setPageSize,
      setSearchQuery: frequency.setSearchQuery,
      isLoading: isLoadings.frequency,
      isError: isErrors.frequency,
    },
    handleLevelChange,
  };
};