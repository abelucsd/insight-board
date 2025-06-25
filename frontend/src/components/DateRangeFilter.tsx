import { useEffect, useState } from "react";
import { MonthPicker } from '@mantine/dates'; // TODO: put at root of the app.
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

interface DateRangeFilterProps {
  onChange: (range: {startDate: Date, endDate: Date}) => void;
  initialRange: { startDate: Date; endDate: Date } | null; 
};


const DateRangeFilter = ({onChange, initialRange}: DateRangeFilterProps) => {
  
  const [dateRange, setDateRange] = useState<{startDate: Date; endDate: Date} | null>(initialRange);
  const [displayRange, setDisplayRange] = useState<[string | null, string | null]>([null, null]);
  const [localRange, setLocalRange] = useState<[string | null, string | null]>([null, null]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (dateRange) {      
      const localStartDate = new Date(dateRange.startDate);
      const localEndDate = new Date(dateRange.endDate);
      
      const initialStartYear = localStartDate.getFullYear();
      const initialStartMonth = localStartDate.getMonth() + 1;
      const initialEndYear = localEndDate.getFullYear();
      const initialEndMonth = localEndDate.getMonth() + 1;

      const startDateString = `${initialStartYear}-${initialStartMonth}`;
      const endDateString = `${initialEndYear}-${initialEndMonth}`;    

      setDisplayRange([startDateString, endDateString]);
    }
  }, [dateRange])

  useEffect(() => {
    if (localRange[0] && localRange[1]) {            
      let selectedStartDate = new Date(localRange[0]);
      let selectedEndDate = new Date(localRange[1]);

      // process date
      const startYear = selectedStartDate.getFullYear();
      const startMonth = selectedStartDate.getMonth();
      const newStartDate = new Date(startYear, startMonth + 1, 1);

      const endYear = selectedEndDate.getFullYear();
      const endMonth = selectedEndDate.getMonth();
      const newEndDate = new Date(endYear, endMonth + 1, 1);      

      setDateRange({startDate: newStartDate, endDate: newEndDate});

    }
  }, [localRange])


  return (
    <div className="relative z-50 flex flex-col">
      <button 
        className={`h-[25px] w-[250px] px-2 border border-[var(--graph-border)] rounded-sm`}
        onClick={() => setIsOpen(!isOpen)}>
        <div>{displayRange[0]} : {displayRange[1]}</div>
      </button>

      { isOpen &&
        <div className={`absolute p-2 w-[280px] border border-[var(--graph-border)] rounded-sm shadow-md bg-white`}>
          <MonthPicker type="range" value={localRange} onChange={setLocalRange} />
          
          <button 
            onClick={() => {              
              if (dateRange?.startDate && dateRange?.endDate) {
                onChange({ startDate: dateRange.startDate, endDate: dateRange.endDate });
              }
              setIsOpen(false)
            }}
            className="mt-2 px-4 py-2 rounded bg-blue-600 text-white"
          >
            Apply
          </button>
        </div>
      }
    </div>
  );
};

export default DateRangeFilter;