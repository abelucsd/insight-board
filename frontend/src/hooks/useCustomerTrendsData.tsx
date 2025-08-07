// TODO: Load and Error states

import '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  getCustomerTrendAnalytics,
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

type LevelState = {
  revenue: LevelType;
  recency: LevelType;
  frequency: LevelType;
};

export const useCustomerTrendsData = () => { 
  const [tables, setTables] = useState<TablesState>({revenue: undefined, recency: undefined, frequency: undefined});
  const [totals, setTotals] = useState<TotalsState>({revenue: 0, recency: 0, frequency: 0});
  const [isLoadings, setIsLoadings] = useState<LoadingState>({revenue: false, recency: false, frequency: false});
  const [isErrors, setIsErrors] = useState<ErrorState>({revenue: false, recency: false, frequency: false});

  const [selectedLevel, setSelectedLevel] = useState<LevelState>({revenue: 'high', recency: 'high', frequency: 'high'});


  const behavior = 'customer-behavior';

  const revenue = usePaginatedSearch();
  const recency = usePaginatedSearch();
  const frequency = usePaginatedSearch();

  const paginateCommandMap = {
    revenue, recency, frequency
  }
  
  const queries = {
    revenue: {
      high: useQuery({queryKey: [behavior, 'spendHigh', revenue.pageIndex, revenue.pageSize, revenue.searchQuery], enabled: 'high' === selectedLevel.revenue, queryFn: getCustomerTrendAnalytics, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
      normal: useQuery({queryKey: [behavior, 'spendNormal', revenue.pageIndex, revenue.pageSize, revenue.searchQuery], enabled: 'normal' === selectedLevel.revenue, queryFn: getCustomerTrendAnalytics, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),      
      low: useQuery({queryKey: [behavior, 'spendLow', revenue.pageIndex, revenue.pageSize, revenue.searchQuery], enabled: 'low' === selectedLevel.revenue, queryFn: getCustomerTrendAnalytics, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
    },
    recency: {
      high: useQuery({queryKey: [behavior, 'recencyHigh', recency.pageIndex, recency.pageSize, recency.searchQuery], enabled: 'high' === selectedLevel.recency, queryFn: getCustomerTrendAnalytics, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
      normal: useQuery({queryKey: [behavior, 'recencyNormal', recency.pageIndex, recency.pageSize, recency.searchQuery], enabled: 'normal' === selectedLevel.recency, queryFn: getCustomerTrendAnalytics, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
      low: useQuery({queryKey: [behavior, 'recencyLow', recency.pageIndex, recency.pageSize, recency.searchQuery], enabled: 'low' === selectedLevel.recency, queryFn: getCustomerTrendAnalytics, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
    },
    frequency: {
      high: useQuery({queryKey: [behavior, 'frequencyHigh', frequency.pageIndex, frequency.pageSize, frequency.searchQuery], enabled: 'high' === selectedLevel.frequency, queryFn: getCustomerTrendAnalytics, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
      normal: useQuery({queryKey: [behavior, 'frequencyNormal', frequency.pageIndex, frequency.pageSize, frequency.searchQuery], enabled: 'normal' === selectedLevel.frequency, queryFn: getCustomerTrendAnalytics, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
      low: useQuery({queryKey: [behavior, 'frequencyLow', frequency.pageIndex, frequency.pageSize, frequency.searchQuery], enabled: 'low' === selectedLevel.frequency, queryFn: getCustomerTrendAnalytics, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false}),
    }
  }


  // Initialize table and total data.
  useEffect(() => {
    if (queries.revenue[selectedLevel.revenue].data) {
      setTables(prev => ({ ...prev, revenue: queries.revenue[selectedLevel.revenue].data!.customerTable}));
      setTotals(prev => ({ ...prev, revenue: queries.revenue[selectedLevel.revenue].data!.total}));
    }
  }, [queries.revenue[selectedLevel.revenue].data]);
  useEffect(() => {
    if (queries.recency[selectedLevel.recency].data) {
      setTables(prev => ({ ...prev, recency: queries.recency[selectedLevel.recency].data!.customerTable}));
      setTotals(prev => ({ ...prev, recency: queries.recency[selectedLevel.recency].data!.total}));
    }
  }, [queries.recency[selectedLevel.recency].data]);
  useEffect(() => {
    if (queries.frequency[selectedLevel.frequency].data) {
      setTables(prev => ({ ...prev, frequency: queries.frequency[selectedLevel.frequency].data!.customerTable}));
      setTotals(prev => ({ ...prev, frequency: queries.frequency[selectedLevel.frequency].data!.total}));
    }
  }, [queries.frequency[selectedLevel.frequency].data]);

  
  // Load and Error states
  useEffect(() => {
    setIsLoadings(prev => ({ ...prev, revenue: queries.revenue[selectedLevel.revenue].isLoading}));        
  }, [queries.revenue[selectedLevel.revenue].isLoading]);
  useEffect(() => {    
    setIsLoadings(prev => ({ ...prev, recency: queries.recency[selectedLevel.recency].isLoading}));
  }, [queries.recency[selectedLevel.recency].isLoading]);
  useEffect(() => {    
    setIsLoadings(prev => ({ ...prev, frequency: queries.frequency[selectedLevel.frequency].isLoading}));
  }, [queries.frequency[selectedLevel.frequency].isLoading]);

  useEffect(() => {    
    setIsErrors(prev => ({ ...prev, revenue: queries.revenue[selectedLevel.revenue].isError}));
  }, [queries.revenue[selectedLevel.revenue].isError]);
  useEffect(() => {    
    setIsLoadings(prev => ({ ...prev, recency: queries.recency[selectedLevel.recency].isError}));
  }, [queries.recency[selectedLevel.recency].isError]);
  useEffect(() => {    
    setIsLoadings(prev => ({ ...prev, frequency: queries.frequency[selectedLevel.frequency].isError}));
  }, [queries.frequency[selectedLevel.frequency].isError]);


  // Event: On Filter  
  const handleLevelChange = (
    behavior: BehaviorType, levelFilter: LevelType) => {
    setSelectedLevel(prev => ({ ...prev, [behavior]: levelFilter}));    
    paginateCommandMap[behavior].setPageIndex(0);    
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
      total: totals.frequency,
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