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


export const useDashboardData = () => {
  const topProductsQuery = useQuery({queryKey: ['topProducts'], queryFn: getTopProducts, staleTime: 1000 * 60 * 2 });
  const monthlySalesQuery = useQuery({queryKey: ['monthlySales'], queryFn: getMonthlySales, staleTime: 1000 * 60 * 2});
  const currMonthSalesQuery = useQuery({queryKey: ['currMonthSales'], queryFn: getCurrMonthSales, staleTime: 1000 * 60 * 2});
  const monthlyRevenueQuery = useQuery({queryKey: ['monthlyRevenue'], queryFn: getMonthlyRevenue, staleTime: 1000 * 60 * 2});
  const currMonthRevenueQuery = useQuery({queryKey: ['currMonthRevenue'], queryFn: getCurrMonthRevenue, staleTime: 1000 * 60 * 2});
  const monthlyProfitQuery = useQuery({queryKey: ['monthlyProfit'], queryFn: getMonthlyProfit, staleTime: 1000 * 60 * 2});  
  
  const isLoading = topProductsQuery.isLoading || 
    monthlySalesQuery.isLoading ||
    currMonthSalesQuery.isLoading ||
    monthlyRevenueQuery.isLoading ||
    currMonthRevenueQuery.isLoading ||
    monthlyProfitQuery.isLoading;    

  return {
    topProducts: topProductsQuery.data,
    monthlySales: monthlySalesQuery.data,
    currMonthSales: currMonthSalesQuery.data,
    monthlyRevenue: monthlyRevenueQuery.data,
    currMonthRevenue: currMonthRevenueQuery.data,
    monthlyProfit: monthlyProfitQuery.data,    
    isLoading,
  };
};