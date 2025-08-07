import React from 'react'
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { TableContext } from './TableContext';

interface TableBaseProps {
  data: Record<number, any>[];
  columns: ColumnDef<any, any>[];
  pageIndex: number,
  pageSize: number;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;  
  total: number;
  children: React.ReactNode;
  isLoading: boolean;
  isError: boolean;
  styles?: string;
};


const TableBase = ({
  data,
  columns,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  total,
  children,
  isLoading,
  isError,
  styles
} : TableBaseProps ) => {

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
  
  return (
    <TableContext.Provider value={table}>
      <div className={`${styles} flex flex-col gap-8 w-full items-end`}>
        {children}
      </div>
    </TableContext.Provider>
  );
};

export default TableBase;