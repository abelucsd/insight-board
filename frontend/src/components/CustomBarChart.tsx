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
  "Jan": 1,
  "Feb": 2,
  "Mar": 3,
  "Apr": 4,
  "May": 5,
  "Jun": 6,
  "Jul": 7,
  "Aug": 8,
  "Sept": 9,
  "Oct": 10,
  "Nov": 11,
  "Dec": 12,
};


const CustomBarChart = ({title, containerStyles, styles, data, x, y}: CustomBarChartProps) => {  
  // date filter. TODO: default range 1 year
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date } | null>({startDate: sixMonthsAgo, endDate: new Date()});
  const [filteredData, setFilteredData] = useState<DataProps[]>([]);

  const onDateChange = (range: {startDate: Date, endDate: Date}) => {
    setDateRange(range);
  };

  useEffect(() => {    
    const startYear = dateRange!.startDate.getFullYear();
    const endYear = dateRange!.endDate.getFullYear();
    const startMonth = dateRange!.startDate.getMonth();
    const endMonth = dateRange!.endDate.getMonth();

    console.log(startYear)
    console.log(endYear)
    console.log(startMonth)
    console.log(endMonth)

    const filtered = data.filter((entry) => {            
      const entryYear: number = entry.year;
      const entryMonth: number = monthLabels[entry.month as keyof typeof monthLabels];

      console.log(`${startMonth}, ${endMonth} and ${entryMonth}`)
      if (entryYear == endYear) {
        console.log("HELLO")
      }
      if (entryMonth <= endMonth) {
        console.log("passed")
      }
      

      const isAfterStart =
        entryYear > startYear ||
        (entryYear === startYear && entryMonth >= startMonth);
      
      const isBeforeEnd = 
        entryYear < endYear ||
        (entryYear == endYear && entryMonth <= endMonth); 
        
      console.log(`${entryYear} and ${entryMonth}`);

      console.log(`${isAfterStart} and ${isBeforeEnd}`)

      return isAfterStart && isBeforeEnd;
    });

    console.log('setting filtered date.');
    setFilteredData(filtered);
  }, [dateRange]);
  
  useEffect(() => {
    console.log(filteredData)
  }, filteredData)

  return (
    <div className={`
      ${containerStyles}
      flex flex-col justify-between overflow-x-auto overflow-y-hidden 
      border border-[var(--graph-border)] rounded-2xl px-8 py-6 bg-white
    `}>
      <div className="flex flex-row justify-between">
        <h3>{title}</h3>
        <DateRangeFilter onChange={onDateChange}/>
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