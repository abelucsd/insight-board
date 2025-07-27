import { useCustomerTrendsData } from '../../hooks/useCustomerTrendsData';
import ViewCustomerGroupTable from './ViewCustomerGroupTable';

const ViewCustomerTrends = () => {
  const {
    revenue,
    recency,
    frequency,   
    handleLevelChange,
  } = useCustomerTrendsData();

  return (
    <div className="container mx-auto flex flex-col gap-8 h-screen py-8 md:p-8 px-2">
      <h2 className="">Customers Grouped by Revenue Contribution</h2>      
      <ViewCustomerGroupTable 
        behavior={'revenue'} 
        behaviorObject={revenue}
        handleLevelChange={handleLevelChange}
      />
      <ViewCustomerGroupTable 
        behavior={'recency'} 
        behaviorObject={recency}
        handleLevelChange={handleLevelChange}
      />
      <ViewCustomerGroupTable 
        behavior={'frequency'} 
        behaviorObject={frequency}
        handleLevelChange={handleLevelChange}
      />    
    </div>
  );

};

export default ViewCustomerTrends;