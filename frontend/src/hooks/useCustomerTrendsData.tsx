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
import { BehaviorClusterCustomers } from '../types/customerTrends';


const defaultHighSpenderCustomers: BehaviorClusterCustomers = {customerTable:[]};
const defaultHighFrequencyCustomers: BehaviorClusterCustomers = {customerTable:[]};
const defaultHighRecencyCustomers: BehaviorClusterCustomers = {customerTable:[]};

export const useCustomerTrendsData = () => {
  const [pageIndexSpend, setPageIndexSpend] = useState(0);
  const [pageSizeSpend, setPageSizeSpend] = useState(10);
  const [searchQuerySpend, setSearchQuerySpend] = useState('');

  const [pageIndexRecency, setPageIndexRecency] = useState(0);
  const [pageSizeRecency, setPageSizeRecency] = useState(10);
  const [searchQueryRecency, setSearchQueryRecency] = useState('');

  const [pageIndexFrequency, setPageIndexFrequency] = useState(0);
  const [pageSizeFrequency, setPageSizeFrequency] = useState(10);
  const [searchQueryFrequency, setSearchQueryFrequency] = useState('');
    
  const highSpenderCustomers = useQuery({queryKey: ['high-spend', pageIndexSpend, pageSizeSpend, searchQuerySpend], queryFn: getHighSpenderCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const normalSpenderCustomers = useQuery({queryKey: ['normal-spend', pageIndexSpend, pageSizeSpend, searchQuerySpend], queryFn: getNormalSpenderCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const lowSpenderCustomers = useQuery({queryKey: ['low-spend', pageIndexSpend, pageSizeSpend, searchQuerySpend], queryFn: getLowSpenderCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});

  const highRecencyCustomers = useQuery({queryKey: ['high-recency', pageIndexRecency, pageSizeRecency, searchQueryRecency], queryFn: getHighRecencyCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const normalRecencyCustomers = useQuery({queryKey: ['normal-recency', pageIndexRecency, pageSizeRecency, searchQueryRecency], queryFn: getNormalRecencyCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const lowRecencyCustomers = useQuery({queryKey: ['low-recency', pageIndexRecency, pageSizeRecency, searchQueryRecency], queryFn: getLowRecencyCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});

  const highFrequencyCustomers = useQuery({queryKey: ['high-frequency', pageIndexFrequency, pageSizeFrequency, searchQueryFrequency], queryFn: getHighFrequencyCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const normalFrequencyCustomers = useQuery({queryKey: ['normal-frequency', pageIndexFrequency, pageSizeFrequency, searchQueryFrequency], queryFn: getNormalFrequencyCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const lowFrequencyCustomers = useQuery({queryKey: ['low-frequency', pageIndexFrequency, pageSizeFrequency, searchQueryFrequency], queryFn: getLowFrequencyCustomers, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});


  const isLoading = highSpenderCustomers.isLoading;
  const isError = highSpenderCustomers.isError;


  const [customerRevenueTable, setCustomerRevenueTable] = useState<BehaviorClusterCustomers | undefined >(undefined);
  const [customerRecencyTable, setCustomerRecencyTable] = useState<BehaviorClusterCustomers | undefined>(undefined);
  const [customerFrequencyTable, setCustomerFrequencyTable] = useState<BehaviorClusterCustomers | undefined>(undefined);

  const [revenueTotal, setRevenueTotal] = useState<number | undefined>(0);
  const [recencyTotal, setRecencyTotal] = useState<number | undefined>(0);
  const [frequencyTotal, setFrequencyTotal] = useState<number | undefined>(0);

  useEffect(() => {
    if (highSpenderCustomers.data) {
      setCustomerRevenueTable(highSpenderCustomers.data.table);
      setRevenueTotal(highSpenderCustomers.data.total);
    }
  }, [highSpenderCustomers.data]);
  useEffect(() => {
    if (highRecencyCustomers.data) {
      setCustomerRecencyTable(highRecencyCustomers.data.table);
      setRecencyTotal(highRecencyCustomers.data.total);      
    }
  }, [highRecencyCustomers.data]);
  useEffect(() => {
    if (highFrequencyCustomers.data) {
      setCustomerFrequencyTable(highFrequencyCustomers.data.table);
      setFrequencyTotal(highFrequencyCustomers.data.total);
    }
  }, [highFrequencyCustomers.data]);

  const handleLevelChange = (behavior: string, levelFilter: string) => {
    switch(behavior) {
      case 'revenue':
        handleChangeLevelRevenue(levelFilter);
        break;
      case 'recency':
        handleChangeLevelRecency(levelFilter);
        break;
      case 'frequency':
        handleChangeLevelFrequency(levelFilter);
        break;
    }
  };

  const handleChangeLevelRevenue = (levelFilter: string) => {
    switch(levelFilter) {
      case 'high':
        setCustomerRevenueTable(highSpenderCustomers.data?.table);
        setRevenueTotal(highSpenderCustomers.data?.total);
        break;
      case 'normal':
        setCustomerRevenueTable(normalSpenderCustomers.data?.table);
        setRevenueTotal(normalSpenderCustomers.data?.total);
        break;
      case 'low':
        setCustomerRevenueTable(lowSpenderCustomers.data?.table);
        setRevenueTotal(lowSpenderCustomers.data?.total);
        break;
      // TODO: add toast.
    };
  };

  const handleChangeLevelRecency = (levelFilter: string) => {
    switch(levelFilter) {
      case 'high':
        setCustomerRecencyTable(highRecencyCustomers.data?.table);
        setRecencyTotal(highRecencyCustomers.data?.total);
        break;
      case 'normal':
        setCustomerRecencyTable(normalRecencyCustomers.data?.table);
        setRecencyTotal(normalRecencyCustomers.data?.total);
        break;
      case 'low':
        setCustomerRecencyTable(lowRecencyCustomers.data?.table);
        setRecencyTotal(lowRecencyCustomers.data?.total);
        break;
      // TODO: add toast.
    };
  };

  const handleChangeLevelFrequency = (levelFilter: string) => {
    switch(levelFilter) {
      case 'high':
        setCustomerFrequencyTable(highFrequencyCustomers.data?.table);
        setFrequencyTotal(highFrequencyCustomers.data?.total);
        break;
      case 'normal':
        setCustomerFrequencyTable(normalFrequencyCustomers.data?.table);
        setFrequencyTotal(normalFrequencyCustomers.data?.total);
        break;
      case 'low':
        setCustomerFrequencyTable(lowFrequencyCustomers.data?.table);
        setFrequencyTotal(lowFrequencyCustomers.data?.total);
        break;
      // TODO: add toast.
    };
  };

  return {
    revenue: {
      table: customerRevenueTable?.customerTable ?? defaultHighSpenderCustomers.customerTable,
      total: revenueTotal ?? 0,
      pageIndex: pageIndexSpend,
      pageSize: pageSizeSpend,
      searchQuery: searchQuerySpend,
      setPageIndex: setPageIndexSpend,
      setPageSize: setPageSizeSpend,
      setSearchQuery: setSearchQuerySpend,
      isLoading: isLoading, // If any isLoading or isError, then none should show.
      isError: isError,     
    },
    recency: {
      table: customerRecencyTable?.customerTable ?? defaultHighRecencyCustomers.customerTable,
      total: recencyTotal ?? 0,
      pageIndex: pageIndexRecency,
      pageSize: pageSizeRecency,
      searchQuery: searchQueryRecency,
      setPageIndex: setPageIndexRecency,
      setPageSize: setPageSizeRecency,
      setSearchQuery: setSearchQueryRecency,
      isLoading: isLoading,
      isError: isError,
    },
    frequency: {
      table: customerFrequencyTable?.customerTable ?? defaultHighFrequencyCustomers.customerTable,
      total: frequencyTotal ?? 0,
      pageIndex: pageIndexFrequency,
      pageSize: pageSizeFrequency,
      searchQuery: searchQueryFrequency,
      setPageIndex: setPageIndexFrequency,
      setPageSize: setPageSizeFrequency,
      setSearchQuery: setSearchQueryFrequency,
      isLoading: isLoading,
      isError: isError,
    },        
    handleLevelChange,
  };
};