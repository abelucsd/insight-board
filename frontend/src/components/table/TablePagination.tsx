import { useTableContext } from './TableContext';



const TablePagination = () => {
  const table = useTableContext();

  return (
    <div className="flex flex-row items-center gap-2">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </button>
      <span>
        Page {' '}
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </span>
      <button 
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </button>
    </div>
  );
};

export default TablePagination;