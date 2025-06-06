import axios from 'axios';
import CustomBarChart from "../components/CustomBarChart";
import { useDashboardData } from "../hooks/useDashboardData";
import CustomStatTrackerBox from "../components/CustomStatTrackerBox";
import CustomTable from "../components/CustomTable";
import { useEffect } from 'react';
import { useVisitAnalytics } from '../hooks/useVisitAnalytics';

const Dashboard = () => {
  const {
    topProducts,
    monthlySales,
    currMonthSales,
    monthlyRevenue,
    currMonthRevenue,
    monthlyProfit,
    currMonthProfit,
    topLocationsBySales,
    isLoading,
    isError, 
  } = useDashboardData();

  const {
    visits,
    handleVisit,
    isVisitLoading,
    isVisitError,
  } = useVisitAnalytics();

  // visiting the dashboard increments a visit.
  useEffect(() => {    
    handleVisit(new Date());
  }, []);

  if (isLoading || isVisitLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">        
        <div className="text-lg mt-4">Loading dashboard...</div>
      </div>
    );
  };
  
  if (isError || isVisitError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-center text-red-600">
        <div className="text-xl mt-4">Oops! Something went wrong. Please try again.</div>        
      </div>
    );
  };  

  return (
    <div className="
      md:container mx-auto flex flex-col lg:grid grid-cols-4 gap-8 
      max-w-[500px] py-8 md:p-8 px-2
    ">      
      <div className="row-start-1 col-start-1 col-end-3">        
        <div className="grid grid-cols-2 gap-8 h-full">
          <CustomStatTrackerBox 
            style={"w-full h-full"}
            title={"Sales"} 
            total={currMonthSales.total} 
            growth={currMonthSales.growth} 
          />
          <CustomStatTrackerBox 
            style={"w-full h-full"}
            title={"Revenue"} 
            total={currMonthRevenue.total} 
            growth={currMonthRevenue.growth} 
          />
          <CustomStatTrackerBox
            style={"w-full h-full"}
            title={"Profit"}
            total={currMonthProfit.total}
            growth={currMonthProfit.growth}
          />
          <CustomStatTrackerBox 
            style={"w-full h-full"}
            title={"Visits"} 
            total={visits}             
          />
        </div>
      </div>
      
      <div className="row-start-1 col-start-3 col-end-5">
        <CustomBarChart 
          containerStyles={"xl:w-auto h-100 xl:h-100"}
          styles={"w-[600px]"}
          title={"Monthly Sales"} 
          data={monthlySales}
          x="month"
          y="total" 
        />
      </div>

      <div className="row-start-2 col-start-1 col-end-3">
        <CustomBarChart 
          containerStyles={"xl:w-auto h-100 xl:h-100"}
          styles={"w-[600px]"}
          title={"Monthly Revenue"} 
          data={monthlyRevenue}
          x="month"
          y="total" 
        />
      </div>

      <div className="row-start-2 col-start-3 col-end-5">
        <CustomBarChart 
          containerStyles={"xl:w-auto h-100 xl:h-100"}
          styles={"w-[600px]"}
          title={"Monthly Profit"} 
          data={monthlyProfit}
          x="month"
          y="total" 
        />
      </div>

      <div className="row-start-4 col-start-1 col-end-3">
        <CustomTable 
          containerStyles={"h-110"}
          styles={""}
          title={"Top Products"}
          rows={topProducts}
          columns={Object.keys(topProducts[0] ?? [])}
        />
      </div>

      <div className="row-start-4 col-start-3 col-end-5">
        <CustomTable 
          containerStyles={"h-110"}
          styles={""}
          title={"Top Locations"}
          rows={topLocationsBySales}
          columns={Object.keys(topLocationsBySales[0] ?? [])}
        />
      </div>

    </div>
  );
};

export default Dashboard;