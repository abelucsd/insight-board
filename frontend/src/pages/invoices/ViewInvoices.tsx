import {  
  createColumnHelper,
} from '@tanstack/react-table';

import { useInvoicesTableData } from '../../hooks/useInvoiceTableData';
import Table from '../../components/Table';
import { ConfirmDialog } from '../../components/ConfirmDialog';

const ViewInvoices = () => {
  const {
    invoices,
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
    handleOpenConfirm,
    handleConfirmDelete,
    handleCancelDelete,
  } = useInvoicesTableData();

  const columnHelper = createColumnHelper<typeof invoices[0]>();

  const columns = [
    columnHelper.accessor('id', {
      header: () => 'Id',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 truncate',
      },
    }),
    columnHelper.accessor('customer', {
      header: () => 'Customer Name',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 truncate',
      },
    }),
    columnHelper.accessor('itemName', {
      header: () => 'Item Name',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 truncate',
      },
    }),
    columnHelper.accessor('itemNumber', {
      header: () => 'Item Number',
      cell: info => info.getValue(),
      meta: {
        className: 'w-24 text-right',
      },
    }),
    columnHelper.accessor('price', {
      header: () => 'Price ($)',
      cell: info => info.getValue().toFixed(2),
      meta: {
        className: 'w-24 text-right',
      },
    }),
    columnHelper.accessor('date', {
      header: () => 'Date',
      cell: info => new Date(info.getValue()).toLocaleDateString(),
      meta: {
        className: 'w-32 text-right',
      },
    }),
    columnHelper.accessor('quantity', {
      header: () => 'Quantity',
      cell: info => info.getValue(),
      meta: {
        className: 'w-24 text-right',
      },
    }),
    columnHelper.accessor('revenue', {
      header: () => 'Revenue ($)',
      cell: info => info.getValue().toFixed(2),
      meta: {
        className: 'w-24 text-right',
      },
    }),
    columnHelper.accessor('cost', {
      header: () => 'Cost ($)',
      cell: info => info.getValue().toFixed(2),
      meta: {
        className: 'w-24 text-right',
      },
    }),
    columnHelper.accessor('profit', {
      header: () => 'Profit ($)',
      cell: info => info.getValue().toFixed(2),
      meta: {
        className: 'w-24 text-right',
      },
    }),
    columnHelper.accessor('location', {
      header: () => 'Location',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 truncate',
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
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
    <div className="container mx-auto flex flex-col gap-8 h-screen py-8 md:p-8 px-2">            
      <h2 className="">Invoices</h2>      
      <Table
        data={invoices}
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

      <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>    
  );

};

export default ViewInvoices;