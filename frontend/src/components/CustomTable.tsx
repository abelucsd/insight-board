

interface CustomTableProps {
  containerStyles?: string;
  styles?: string;
  title: string;
  rows: Record<string, any>[];
  columns: string[];      
};


const CustomTable = ({containerStyles, styles, title, rows, columns}: CustomTableProps) => {  

  return (
    <div className={`
      ${containerStyles}
      flex flex-col justify-between overflow-x-auto overflow-y-hidden 
      border border-[var(--graph-border)] rounded-2xl px-8 py-6 bg-white
    `}>
      <h3>{title}</h3>

      <table className={`${styles} table-auto`}>
        <thead className="text-left ">
          <tr>
            {columns.map((col, index) => 
              <th className="p-4" key={index}>{col}</th>
            )}
          </tr>
        </thead>
        
        <tbody>
          {rows.map((row, index) =>
            <tr key={index}>
              {columns.map((col) => (
                <td key={col}
                  className="
                    p-4 relative after:absolute after:bottom-0 after:left-0 
                    after:border-b after:w-full after:h-full after:opacity-20
                  "
                >{row[col]}</td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;