import React, { useEffect, useState } from 'react'
import {  
  createColumnHelper,
} from '@tanstack/react-table';
import Table from '../../components/Table';
import { CustomerTable, BehaviorType, LevelType } from '../../types/customerTrends';

interface ViewCustomerGroupTableProps {
  behavior: BehaviorType;    
  behaviorObject: {
    customerTable: CustomerTable;
    total: number;
    pageIndex: number;
    pageSize: number;
    searchQuery: string;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    isError: boolean;
  };
  handleLevelChange: (behavior: BehaviorType, levelType: LevelType) => void;
}

const ViewCustomerGroupTable = ({behavior, behaviorObject, handleLevelChange}: ViewCustomerGroupTableProps) => {

  const [behaviorTitle, setBehaviorTitle] = useState<string>(behavior);
  const [level, setLevel] = useState<string>('High');

  useEffect(() => {
    let title = behaviorTitle;
    title = title.charAt(0).toUpperCase() + title.slice(1);
    setBehaviorTitle(title);
  }, [])  

  const handleClick = (behavior: BehaviorType, levelType: LevelType) => {
    handleLevelChange(behavior, levelType);
    let newLevel = levelType;
    newLevel = newLevel.charAt(0).toUpperCase() + newLevel.slice(1);
    setLevel(newLevel);
  };  

  const columnHelper = createColumnHelper<typeof behaviorObject.customerTable[0]>();
  
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
      <h2>{level} {behaviorTitle}</h2>
      <div className="flex flex-col">
        <div className="flex flex-row justify-end gap-2">
          <button className='btn-secondary' onClick={() => handleClick(behavior, 'high')}>High</button>
          <button className='btn-secondary' onClick={() => handleClick(behavior, 'normal')}>Normal</button>
          <button className='btn-secondary' onClick={() => handleClick(behavior, 'low')}>Low</button>
        </div>
        <Table
          data={behaviorObject.customerTable}
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
};

export default ViewCustomerGroupTable;