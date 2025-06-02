import {  
  createColumnHelper,
} from '@tanstack/react-table';

import { useProductsTableData } from '../../hooks/useProductsTableData';
import Table from '../../components/Table';

const ViewProducts = () => {
  const {
    products,
    total,
    isLoading,
    isError,
    pageIndex,
    pageSize,
    searchQuery,
    setPageIndex,
    setPageSize,
    setSearchQuery,
    handleDelete
  } = useProductsTableData();

  const columnHelper = createColumnHelper<typeof products[0]>();

  const columns = [
    columnHelper.accessor('name', {
      header: () => 'Product Name',
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
        <button
          onClick={() => handleDelete(row.original._id)}
          className="text-red-600 hover:text-red-800"
        >
         Delete 
        </button>
      ),
    })
  ];


  return (
    <div className="container mx-auto flex flex-col gap-8 h-screen py-8 md:p-8 px-2">
      <h2 className="">Products</h2>
      <div>
        <Table
          data={products}
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
      </div>
    </div>
  )

};

export default ViewProducts;