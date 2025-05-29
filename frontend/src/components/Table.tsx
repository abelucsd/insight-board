import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,  
  flexRender,  
  ColumnDef
} from '@tanstack/react-table';

import { useState } from 'react';

interface TableProps {
  data: Record<number, any>[];
  total: number;
  pageIndex: number;
  pageSize: number;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  columns: ColumnDef<any, any>[];
  isLoading: boolean;
  isError: boolean;
}

const ViewProducts = ({
  data,
  total,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  columns,
  isLoading,
  isError,
} : TableProps) => {
  
  const [globalFilter, setGlobalFilter] = useState('');  
  
  const table = useReactTable({
    data: data ?? [],
    columns,    
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      }
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    },
    pageCount: Math.ceil((total ?? 0) / pageSize),
    manualPagination: true,
    onPaginationChange: updater => {
      const newState = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newState.pageIndex);
    },    
  });


  return (
    <table className="min-w-full border border-gray-300">
      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search products..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              const canSort = header.column.getCanSort();
              const sortDir = header.column.getIsSorted();
              return (
                <th 
                  key={header.id}
                  onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  className={`border px-4 py-2 text-left cursor-pointer select-none ${
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
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>

      {/* Pagination Controls */}
      <div>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span>
          Page {' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <button 
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}          
        >
          Next
        </button>
      </div>

      {/* Control Page Size */}
      <select
        value={table.getState().pagination.pageSize}
        onChange={e => table.setPageSize(Number(e.target.value))}
        className="ml-4 border rounded px-2 py-1"
      >
        {[5, 10, 20].map(size => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select>
    </table>
  );
};

export default ViewProducts;