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
    setPageIndex,
    setPageSize,
  } = useProductsTableData();  

  const columnHelper = createColumnHelper<typeof products[0]>();

  const columns = [
    columnHelper.accessor('name', {
      header: () => 'Product Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('price', {
      header: () => 'Price ($)',
      cell: info => info.getValue().toFixed(2),
    }),
    columnHelper.accessor('description', {
      header: () => 'Description',
      cell: info => info.getValue(),
    }),
  ];

  return (
    <div>
      <Table
        data={products}
        total={total}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  )

};

export default ViewProducts;