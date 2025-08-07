import { flexRender } from "@tanstack/react-table";
import { useTableContext } from "./TableContext"


const TableCore = () => {
  const table = useTableContext();

  const emptyRowCount = table.getState().pagination.pageSize - table.getRowModel().rows.length;

  return (
    <div className="mx-auto w-[400px] md:w-full overflow-x-auto border-[var(--color-table-border)] border-[2px] rounded-xl bg-white">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="bg-white">
              {headerGroup.headers.map(header => {
                const canSort = header.column.getCanSort();
                const sortDir = header.column.getIsSorted();
                return (
                  <th 
                    key={header.id}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    className={`border-b border-[var(--color-table-border)] px-6 py-4 pt-6 text-left cursor-pointer select-none ${
                      canSort ? 'hover:bg-gray-200' : ''
                    }`}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {sortDir === 'asc' ? ' ▲' : sortDir === 'desc' ? ' ▼' : ''}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-b border-gray-200 bg-white shadow-sm rounded">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {Array.from({ length: emptyRowCount }).map((_, index) => (
            <tr key={`empty-${index}`} className="border-b border-gray-200 bg-white shadow-sm">
              {table.getAllColumns().map(col => (
                <td key={col.id} className="px-4 py-4">&nbsp;</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableCore;