import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,  
  flexRender,  
  ColumnDef
} from '@tanstack/react-table';

import { useEffect } from 'react';

interface TableProps {
  data: Record<number, any>[];
  total: number;
  pageIndex: number;
  pageSize: number;
  searchQuery: string;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  setSearchQuery: (search: string) => void;
  columns: ColumnDef<any, any>[];
  isLoading: boolean;
  isError: boolean;
  extraFilters?: string;
}

const Table = ({
  data,
  total,
  pageIndex,
  pageSize,
  searchQuery,
  setPageIndex,
  setPageSize,
  setSearchQuery,
  columns,
  isLoading,
  isError,
} : TableProps) => {  

  useEffect(() => {
    setPageIndex(0);
  }, [searchQuery]);
  
  const table = useReactTable({
    data: data ?? [],
    columns,    
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {      
      pagination: {
        pageIndex,
        pageSize,
      },
    },  
    pageCount: Math.ceil((total ?? 0) / pageSize),
    manualPagination: true,
    onPaginationChange: updater => {
      const newState = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize)
    },    
  });

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  };

  if (isError) {
    return <div className="p-4 text-center text-red-600">
      Error: {'Failed to load data.'}
    </div>;
  };

  const emptyRowCount = pageSize - table.getRowModel().rows.length;


  return (
    <div className="flex flex-col gap-8 items-end">

      {/* Search Input */}
      <div className="float-right my-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setPageIndex(0);
          }}
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* md:w-auto */}
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
                {columns.map(col => (
                  <td key={col.id} className="px-4 py-4">&nbsp;</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Pagination Controls */}
      <div className="float-right flex flex-col gap-4 my-4">
        <div className="flex flex-row items-center gap-2">
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
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[5, 10, 20].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
      
    </div>
  );
};

export default Table;