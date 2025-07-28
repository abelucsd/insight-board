import React, { useEffect, useState } from 'react'
import {  
  createColumnHelper,
} from '@tanstack/react-table';
import Table from '../../components/Table';
import { BehaviorClusterCustomers } from '../../types/customerTrends';

interface ViewCustomerGroupTableProps {
  behavior: string;    
  behaviorObject: {
    table: {
        name: string;
        id: string;
        email: string;
    }[];
    total: number;
    pageIndex: number;
    pageSize: number;
    searchQuery: string;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    isError: boolean;
  }
  handleLevelChange: (behavior: string, levelType: string) => void;
}

const ViewCustomerGroupTable = ({behavior, behaviorObject, handleLevelChange}: ViewCustomerGroupTableProps) => {

  const [behaviorTitle, setBehaviorTitle] = useState<string>(behavior);
  useEffect(() => {
    let title = behaviorTitle;
    title.charAt(0).toUpperCase;
    setBehaviorTitle(title);
  }, [])

  const handleClick = (levelType: string) => {
    handleLevelChange(behavior, levelType);
  };

  const columnHelper = createColumnHelper<typeof behaviorObject.table[0]>();
  
  const columns = [
    columnHelper.accessor('id', {
      header: () => 'Id',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 truncate'
      }
    }),
    columnHelper.accessor('name', {
      header: () => 'Name',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 truncate',
      }
    }),
    columnHelper.accessor('email', {
      header: () => 'Email',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 truncate',
      }
    })
  ];



  return (
    <div className="container mx-auto flex flex-col gap-8 h-screen py-8 md:p-8 px-2">
      <h2 className="">Customers Grouped by {behaviorTitle} Contribution</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <button onClick={() => handleClick('high')}>High</button>
          <button onClick={() => handleClick('normal')}>Normal</button>
          <button onClick={() => handleClick('low')}>Low</button>
        </div>
        <Table
          data={behaviorObject.table}
          total={behaviorObject.total}
          pageIndex={behaviorObject.pageIndex}
          pageSize={behaviorObject.pageSize}
          searchQuery={behaviorObject.searchQuery}
          setPageIndex={behaviorObject.setPageIndex}
          setPageSize={behaviorObject.setPageSize}
          setSearchQuery={behaviorObject.setSearchQuery}
          columns={columns}
          isLoading={behaviorObject.isLoading}
          isError={behaviorObject.isError}
        />
      </div>
    </div>
  )
}

export default ViewCustomerGroupTable