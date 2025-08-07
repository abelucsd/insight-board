import {  
  createColumnHelper,
} from '@tanstack/react-table';

import { useProductsTableData } from '../../hooks/useProductsTableData';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { UpdateProductModal } from '../../components/UpdateProductModal';
import TableBase from '../../components/table/TableBase';
import TableSearch from '../../components/table/TableSearch';
import TableCore from '../../components/table/TableCore';
import TablePagination from '../../components/table/TablePagination';
import TablePageSizeSelector from '../../components/table/TablePageSizeSelector';

const ViewProducts = () => {
  const {
    products,
    total,
    isLoading,
    isError,
    pageIndex,
    pageSize,
    searchQuery,
    isUpdateOpen,
    selectedProduct,
    isDialogOpen,
    setPageIndex,
    setPageSize,
    setSearchQuery,
    handleUpdate,    
    handleOpenEdit,
    handleCloseEdit,
    handleOpenConfirm,
    handleConfirmDelete,
    handleCancelDelete,
  } = useProductsTableData();

  const columnHelper = createColumnHelper<typeof products[0]>();

  const columns = [
    columnHelper.accessor('id', {
      header: () => 'Id',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 truncate',
      },
    }),
    columnHelper.accessor('name', {
      header: () => 'Product Name',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 truncate',
      },
    }),
    columnHelper.accessor('category', {
      header: () => 'Category',
      cell: info => info.getValue(),
      meta: {
        className: 'w-48 truncate',
      },
    }),
    columnHelper.accessor('price', {
      header: () => 'Price ($)',
      cell: info => info.getValue().toFixed(2),
      meta: {
        className: 'w-24 text-right',
      },
    }),
    columnHelper.accessor('salePrice', {
      header: () => 'Sale Price ($)',
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
    columnHelper.accessor('description', {
      header: () => 'Description',
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
    <div className="container mx-auto flex flex-col gap-8 h-screen py-8 md:p-8 px-2">
      <h2 className="">Products</h2>
      <TableBase
        data={products}
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

      <UpdateProductModal
        isOpen={isUpdateOpen}
        onClose={handleCloseEdit}
        product={selectedProduct}
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

export default ViewProducts;