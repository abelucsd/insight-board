import { useEffect, useState } from "react";
import { MonthPicker } from '@mantine/dates'; // TODO: put at root of the app.
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

interface DateRangeFilterProps {
  onChange: (range: {startDate: Date, endDate: Date}) => void;
  initialRange: { startDate: Date; endDate: Date } | null; 
};

const DateRangeFilter = ({onChange, initialRange}: DateRangeFilterProps) => {
  
  const dateRange: {startDate: Date; endDate: Date} | null = initialRange;
  const [displayRange, setDisplayRange] = useState<[string | null, string | null]>([null, null]);
  const [localRange, setLocalRange] = useState<[string | null, string | null]>([null, null]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const initialStartYear = dateRange?.startDate.getFullYear();
    const initialStartMonth = dateRange?.startDate.getMonth();
    const initialEndYear = dateRange?.endDate.getFullYear();
    const initialEndMonth = dateRange?.endDate.getMonth();

    const startDateString = `${initialStartYear}-${initialStartMonth}`;
    const endDateString = `${initialEndYear}-${initialEndMonth}`;

    setDisplayRange([startDateString, endDateString]);
  }, [dateRange])

  useEffect(() => {
    if (localRange[0] && localRange[1]) {
      const startDisplayDate = localRange[0]!.slice(0, 7);
      const endDisplayDate = localRange[1]!.slice(0, 7);

      setDisplayRange([startDisplayDate, endDisplayDate]);
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
              const [startDate, endDate] = localRange;
              if (startDate && endDate) {                
                onChange({ startDate: new Date(startDate), endDate: new Date(endDate) });
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