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


const CustomBarChart = ({title, containerStyles, styles, data, x, y}: CustomBarChartProps) => {  
  return (
    <div className={`
      ${containerStyles}
      flex flex-col justify-between overflow-x-auto overflow-y-hidden 
      border border-[var(--graph-border)] rounded-2xl px-8 py-6 bg-white
    `}>
      <h3>{title}</h3>
      <div className={`${styles} relative h-full`}>
        <ResponsiveContainer className="absolute bottom-0" width="100%" height="80%">
          <BarChart 
            data={data}
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