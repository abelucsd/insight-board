import {  
  createColumnHelper,
} from '@tanstack/react-table';

import { useCustomersTableData } from '../../hooks/useCustomersTableData';
import Table from '../../components/Table';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { UpdateCustomerModal } from '../../components/UpdateCustomerModal';
import TableCore from '../../components/table/TableCore';
import TableSearch from '../../components/table/TableSearch';
import TableBase from '../../components/table/TableBase';
import TablePagination from '../../components/table/TablePagination';
import TablePageSizeSelector from '../../components/table/TablePageSizeSelector';

const ViewCustomers = () => {
  const {
    customers,
    total,
    isLoading,
    isError,
    pageIndex,
    pageSize,
    searchQuery,    
    isDialogOpen,
    setPageIndex,
    setPageSize,
    setSearchQuery,
    handleOpenEdit,
    handleCloseEdit,
    handleUpdate,
    isUpdateOpen,
    selectedCustomer,
    handleOpenConfirm,
    handleConfirmDelete,
    handleCancelDelete,    
  } = useCustomersTableData();

  const columnHelper = createColumnHelper<typeof customers[0]>();

  const columns = [
    columnHelper.accessor('id', {
      header: () => 'Id',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 truncate',
      },
    }),
    columnHelper.accessor('name', {
      header: () => 'Customer Name',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 truncate',
      },
    }),
    columnHelper.accessor('number', {
      header: () => 'Number',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 truncate',
      },
    }),
    columnHelper.accessor('address', {
      header: () => 'Address',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 text-right',
      },
    }),
    columnHelper.accessor('email', {
      header: () => 'Email',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 text-right',
      },
    }),    
    columnHelper.display({
      id: 'actions',
      header: () => 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleOpenEdit(row.original)}
            className="text-blue-600 hover:text-blue-800"
          >
            Update
          </button>

          <button
            onClick={() => handleOpenConfirm(row.original._id)}
            className="text-red-600 hover:text-red-800"
          >
          Delete 
          </button>
        </div>
      ),
    })
  ];


  return (
    <div className="container mx-auto flex flex-col gap-8 h-screen py-8 md:p-8 px-2 w-full">
      <h2 className="">Customers</h2>
      <TableBase
        data={customers}
        total={total}
        pageIndex={pageIndex}
        pageSize={pageSize}        
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}        
        columns={columns}
        isLoading={isLoading}
        isError={isError}
      >
        <TableSearch searchQuery={searchQuery} onChange={setSearchQuery}/>
        <TableCore />
        <div className="float-right flex flex-col gap-4 my-4">
          <TablePagination />
          <TablePageSizeSelector />
        </div>
      </TableBase>

      <Table
        data={customers}
        total={total}
        pageIndex={pageIndex}
        pageSize={pageSize}
        searchQuery={searchQuery}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        setSearchQuery={setSearchQuery}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
      />

      <UpdateCustomerModal
        isOpen={isUpdateOpen}
        onClose={handleCloseEdit}
        customer={selectedCustomer}
        onUpdate={handleUpdate}
      />

      <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>    
  );

};

export default ViewCustomers;