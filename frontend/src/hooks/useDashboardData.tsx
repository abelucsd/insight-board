import '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { 
  getTopProducts,
  getMonthlyInvoices,
  getCurrMonthInvoices,
  getMonthlyRevenue,
  getCurrMonthRevenue,
  getMonthlyProfit,  
  getCurrMonthProfit,
  getTopLocationsBySales,
} from '../api/invoiceAnalyticsAPI';
import { CurrMonthData, MonthlyData, TopProducts, TopLocations } from '../types/invoiceAnalytics';


const defaultTopProducts: TopProducts[] = [];
const defaultTopLocations: TopLocations[] = [];
const defaultMonthlyData: MonthlyData[] = [];
const defaultCurrMonthData: CurrMonthData = {total: 0, growth: 0};

export const useDashboardData = () => {
  const topProductsQuery = useQuery({queryKey: ['topProducts'], queryFn: getTopProducts, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const monthlyInvoicesQuery = useQuery({queryKey: ['monthlyInvoices'], queryFn: getMonthlyInvoices, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const currMonthInvoicesQuery = useQuery({queryKey: ['currMonthInvoices'], queryFn: getCurrMonthInvoices, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const monthlyRevenueQuery = useQuery({queryKey: ['monthlyRevenue'], queryFn: getMonthlyRevenue, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const currMonthRevenueQuery = useQuery({queryKey: ['currMonthRevenue'], queryFn: getCurrMonthRevenue, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const monthlyProfitQuery = useQuery({queryKey: ['monthlyProfit'], queryFn: getMonthlyProfit, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});  
  const currMonthProfitQuery = useQuery({queryKey: ['currMonthProfit'], queryFn: getCurrMonthProfit, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const topLocationsBySalesQuery = useQuery({queryKey: ['topLocationsBySales'], queryFn: getTopLocationsBySales, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  
  const isLoading = topProductsQuery.isLoading || 
    monthlyInvoicesQuery.isLoading ||
    currMonthInvoicesQuery.isLoading ||
    monthlyRevenueQuery.isLoading ||
    currMonthRevenueQuery.isLoading ||
    monthlyProfitQuery.isLoading ||
    currMonthProfitQuery.isLoading ||
    topLocationsBySalesQuery.isLoading;
    
  const isError = topProductsQuery.isError || 
    monthlyInvoicesQuery.isError ||
    currMonthInvoicesQuery.isError ||
    monthlyRevenueQuery.isError ||
    currMonthRevenueQuery.isError ||
    monthlyProfitQuery.isError ||
    currMonthProfitQuery.isError ||
    topLocationsBySalesQuery.isError;

  return {
    topProducts: topProductsQuery.data ?? defaultTopProducts,
    monthlyInvoices: monthlyInvoicesQuery.data ?? defaultMonthlyData,
    currMonthInvoices: currMonthInvoicesQuery.data ?? defaultCurrMonthData,
    monthlyRevenue: monthlyRevenueQuery.data ?? defaultMonthlyData,
    currMonthRevenue: currMonthRevenueQuery.data ?? defaultCurrMonthData,
    monthlyProfit: monthlyProfitQuery.data ?? defaultMonthlyData,
    currMonthProfit: currMonthProfitQuery.data ?? defaultCurrMonthData,
    topLocationsBySales: topLocationsBySalesQuery.data ?? defaultTopLocations,
    isLoading,
    isError,
  };
};