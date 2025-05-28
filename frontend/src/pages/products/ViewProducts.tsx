import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,  
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';


// TODO: Get products from API
import { products } from '../../utils/data';
import { useState } from 'react';

const columnHelper = createColumnHelper<typeof products[0]>();

const columns = [
  columnHelper.accessor('name', {
    header: () => 'Product Name',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('price', {
    header: () => 'Price ($)',
    cell: info => info.getValue().toFixed(2),
  }),
  columnHelper.accessor('stock', {
    header: () => 'Stock',
    cell: info => info.getValue(),
  }),
];

const ViewProducts = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  
  const table = useReactTable({
    data: products,
    columns,    
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
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
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <button 
          className="px-3 py-1 border rounded disabled:opacity-50"
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