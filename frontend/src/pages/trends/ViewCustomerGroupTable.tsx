import React, { useEffect, useState } from 'react'
import {  
  createColumnHelper,
} from '@tanstack/react-table';
import { CustomerTable, BehaviorType, LevelType } from '../../types/customerTrends';
import TableBase from '../../components/table/TableBase';
import TableCore from '../../components/table/TableCore';
import TablePagination from '../../components/table/TablePagination';
import TableLevelFilter from './TableLevelFilter';
import TableSearch from '../../components/table/TableSearch';

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
  const [activeLevel, setActiveLevel] = useState<LevelType>('high');
  const [level, setLevel] = useState<string>('High');

  useEffect(() => {
    let title = behaviorTitle;
    title = title.charAt(0).toUpperCase() + title.slice(1);
    setBehaviorTitle(title);
  }, [])  

  const handleClick = (behavior: BehaviorType, levelType: LevelType) => {
    handleLevelChange(behavior, levelType);
    setActiveLevel(levelType);
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
    <div className="container mx-auto flex flex-col gap-8 py-8 md:p-8 px-2">
      <h2>{level} {behaviorTitle}</h2>      
        <TableBase
          data={behaviorObject.customerTable}
          total={behaviorObject.total}
          pageIndex={behaviorObject.pageIndex}
          pageSize={behaviorObject.pageSize}
          setPageIndex={behaviorObject.setPageIndex}
          setPageSize={behaviorObject.setPageSize}        
          columns={columns}
          isLoading={behaviorObject.isLoading}
          isError={behaviorObject.isError}
        >
          <div className='flex flex-row justify-between w-full'>
            <TableLevelFilter behavior={behavior} activeLevel={activeLevel} handleClick={handleClick}/>                        
          </div>
          <TableCore />
          <div className="float-right flex flex-col gap-4 my-4">
            <TablePagination />
          </div>
        </TableBase>
    </div>
  )
};

export default ViewCustomerGroupTable;