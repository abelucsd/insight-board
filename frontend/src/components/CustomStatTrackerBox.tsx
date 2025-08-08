
interface CustomStatTrackerBox {
  style?: string;
  title: string;
  total: number;
  growth?: number;
};

const CustomStatTrackerBox = ({style, title, total, growth}: CustomStatTrackerBox) => {  
  const growthText = typeof growth === 'number'
    ? (growth < 0 ? `-${growth*-1}`: `+${growth}`)
    : null;

  return (
    <div className={`
      ${style}      
      flex flex-col justify-between gap-2 md:gap-0
      border border-[var(--graph-border)] rounded-2xl px-8 py-6 bg-white      
    `}>
      <h3>{title}</h3>

      <div className="
        flex flex-col md:flex-row items-start md:justify-between md:items-end 
        gap-2 md:gap-0        
      ">
        <p className="text-2xl font-bold">{total}</p>
        {typeof growth === 'number' && (
          <p
            className={`
              rounded-md p-1
              text-sm
              break-words
              ${growth < 0 ? 
                "bg-red-100": 
                "bg-green-100"}
              after:content-['%']
            `}
          >{growthText}</p>
        )}
      </div>
    </div>
  );
};

export default CustomStatTrackerBox;