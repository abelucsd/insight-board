import CustomBarChart from "../components/CustomBarChart";
import { useDashboardData } from "../hooks/useDashboardData";
import CustomStatTrackerBox from "../components/CustomStatTrackerBox";
import CustomTable from "../components/CustomTable";

const Dashboard = () => {
  const {
    topProducts,
    monthlySales,
    currMonthSales,
    monthlyRevenue,
    currMonthRevenue,
    monthlyProfit,    
    isLoading,    
  } = useDashboardData();  

  if (isLoading) return <div>Loading dashboard...</div>;
  if (!monthlySales || !monthlyRevenue || !monthlyProfit ) {
    return <p>No sales data available</p>;
  }
  if (!currMonthSales || !currMonthRevenue ) {
    return <p>No data available.</p>
  }
  if (!topProducts) {
    return <p>No data available.</p>
  }

  return (
    <div className="
      md:container mx-auto flex flex-col lg:grid grid-cols-4 gap-8 
      max-w-[500px] py-8 md:p-8 px-2
    ">      
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

      <div className="row-start-2 col-start-3 col-end-5">
        <CustomBarChart 
          containerStyles={"xl:w-auto h-100 xl:h-100"}
          styles={"w-[600px]"}
          title={"Monthly Revenue"} 
          data={monthlyRevenue}
          x="month"
          y="total" 
        />
      </div>

      <div className="row-start-3 col-start-3 col-end-5">
        <CustomBarChart 
          containerStyles={"xl:w-auto h-100 xl:h-100"}
          styles={"w-[600px]"}
          title={"Monthly Profit"} 
          data={monthlyProfit}
          x="month"
          y="total" 
        />
      </div>

      <div>
          <CustomStatTrackerBox 
            style={"w-auto h-full"}
            title={"Sales"} 
            total={currMonthSales?.total} 
            growth={currMonthSales?.growth} 
          />
        </div>

        <div>
          <CustomStatTrackerBox 
            style={"w-auto h-full"}
            title={"Revenue"} 
            total={currMonthRevenue?.total} 
            growth={currMonthRevenue?.growth} 
          />
        </div>

        <div className="row-start-4 col-start-3 col-end-5">
          <CustomTable 
            containerStyles={"h-110"}
            styles={""}
            title={"Top Products"}
            rows={topProducts}
            columns={Object.keys(topProducts[0] ?? [])}
          />
      </div>

    </div>
  );
};

export default Dashboard;