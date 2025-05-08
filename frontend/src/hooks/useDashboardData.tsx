import '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { 
  getTopProducts,
  getMonthlySales,
  getCurrMonthSales,
  getMonthlyRevenue,
  getCurrMonthRevenue,
  getMonthlyProfit,  
} from '../api/invoiceAnalyticsAPI';
import { CurrMonthData, MonthlyData, TopProducts } from '../types/invoiceAnalytics';


const defaultTopProducts: TopProducts[] = [];
const defaultMonthlyData: MonthlyData[] = [];
const defaultCurrMonthData: CurrMonthData = {total: 0, growth: 0};

export const useDashboardData = () => {
  const topProductsQuery = useQuery({queryKey: ['topProducts'], queryFn: getTopProducts, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const monthlySalesQuery = useQuery({queryKey: ['monthlySales'], queryFn: getMonthlySales, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const currMonthSalesQuery = useQuery({queryKey: ['currMonthSales'], queryFn: getCurrMonthSales, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const monthlyRevenueQuery = useQuery({queryKey: ['monthlyRevenue'], queryFn: getMonthlyRevenue, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const currMonthRevenueQuery = useQuery({queryKey: ['currMonthRevenue'], queryFn: getCurrMonthRevenue, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});
  const monthlyProfitQuery = useQuery({queryKey: ['monthlyProfit'], queryFn: getMonthlyProfit, staleTime: 1000 * 60 * 60 * 24 * 30, refetchInterval: false});  
  
  const isLoading = topProductsQuery.isLoading || 
    monthlySalesQuery.isLoading ||
    currMonthSalesQuery.isLoading ||
    monthlyRevenueQuery.isLoading ||
    currMonthRevenueQuery.isLoading ||
    monthlyProfitQuery.isLoading;
    
  const isError = topProductsQuery.isError || 
    monthlySalesQuery.isError ||
    currMonthSalesQuery.isError ||
    monthlyRevenueQuery.isError ||
    currMonthRevenueQuery.isError ||
    monthlyProfitQuery.isError;

  return {
    topProducts: topProductsQuery.data ?? defaultTopProducts,
    monthlySales: monthlySalesQuery.data ?? defaultMonthlyData,
    currMonthSales: currMonthSalesQuery.data ?? defaultCurrMonthData,
    monthlyRevenue: monthlyRevenueQuery.data ?? defaultMonthlyData,
    currMonthRevenue: currMonthRevenueQuery.data ?? defaultCurrMonthData,
    monthlyProfit: monthlyProfitQuery.data ?? defaultMonthlyData,
    isLoading,
    isError,
  };
};