import { createContext, useContext } from 'react';
import type { useReactTable } from '@tanstack/react-table';

export const TableContext = createContext<ReturnType<typeof useReactTable> | null>(null);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) throw new Error('useTableContext must be used within a <Table.Provider>');
  return context;
};