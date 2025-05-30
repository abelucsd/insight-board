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
  ];

  return (
    <div className="container mx-auto h-screen">
      <h2 className="my-8">Products</h2>
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
  )

};

export default ViewProducts;