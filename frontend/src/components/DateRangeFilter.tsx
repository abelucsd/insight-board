import { useState } from "react";
import { DatePicker } from '@mantine/dates'; // TODO: put at root of the app.
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

interface DateRangeFilterProps {
  onChange: (range: {startDate: Date, endDate: Date}) => void;
};

const DateRangeFilter = ({onChange}: DateRangeFilterProps) => {  
  const [localRange, setLocalRange] = useState<[string | null, string | null]>([null, null]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative z-50 flex flex-col">
      <button 
        className={`h-[25px] w-[250px] px-2 border border-[var(--graph-border)] rounded-sm`}
        onClick={() => setIsOpen(!isOpen)}>
        <div>{localRange[0]} : {localRange[1]}</div>
      </button>

      { isOpen &&
        <div className={`absolute p-2 w-[280px] border border-[var(--graph-border)] rounded-sm shadow-md bg-white`}>
          <DatePicker type="range" value={localRange} onChange={setLocalRange} />
          
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