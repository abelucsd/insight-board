import { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,  
} from "recharts";
import DateRangeFilter from "./DateRangeFilter";

 
interface DataProps {
  [key: string]: any;
};

interface CustomBarChartProps {
  title: string;
  containerStyles?: string;
  styles?: string;
  data: DataProps[];
  x: string;
  y: string;
};

const monthLabels = {
  "Jan": 0,
  "Feb": 1,
  "Mar": 2,
  "Apr": 3,
  "May": 4,
  "Jun": 5,
  "Jul": 6,
  "Aug": 7,
  "Sept": 8,
  "Oct": 9,
  "Nov": 10,
  "Dec": 11,
};


const CustomBarChart = ({title, containerStyles, styles, data, x, y}: CustomBarChartProps) => {    
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date } | null>({startDate: sixMonthsAgo, endDate: new Date()});
  const [filteredData, setFilteredData] = useState<DataProps[]>([]);

  useEffect(() => {            
    const startYear: number = dateRange!.startDate.getFullYear();
    const endYear: number = dateRange!.endDate.getFullYear();    
    const startMonth: number = dateRange!.startDate.getMonth();
    const endMonth: number = dateRange!.endDate.getMonth();    

    const filtered = data.filter((entry) => {            
      const entryYear: number = parseInt(entry.year);
      const entryMonth: number = monthLabels[entry.month as keyof typeof monthLabels];

      const isAfterStart =
        entryYear > startYear ||
        (entryYear === startYear && entryMonth >= startMonth);
      
      const isBeforeEnd = 
        entryYear < endYear ||
        (entryYear === endYear && entryMonth <= endMonth);

      return isAfterStart && isBeforeEnd;
    });
    
    setFilteredData(filtered);
  }, [dateRange]);


  return (
    <div className={`
      ${containerStyles}
      flex flex-col justify-between overflow-x-auto overflow-y-hidden 
      border border-[var(--graph-border)] rounded-2xl px-8 py-6 bg-white
    `}>
      <div className="flex flex-row justify-between">
        <h3>{title}</h3>
        <DateRangeFilter initialRange={dateRange} onChange={setDateRange}/>
      </div>

      <div className={`${styles} relative h-full`}>
        <ResponsiveContainer className="absolute bottom-0" width="100%" height="80%">
          <BarChart 
            data={filteredData}
            margin={{
              top: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey={x} tick={{ fontSize: 12, fill: `var(--graph-primary)`}} stroke="none" />
            <YAxis />

            <Tooltip />
            <Legend />

            <Bar dataKey={y} fill="#8884d8" activeBar={<Rectangle fill={`var(--graph-active)`} stroke="blue" />} />
          </BarChart>          
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomBarChart;