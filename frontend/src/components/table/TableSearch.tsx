
interface TableSearchProps {
  searchQuery: string;
  onChange: (v: string) => void;
  styles?: string;
};

const TableSearch = ({searchQuery, onChange, styles }: TableSearchProps) => {
  return (    
    <input 
      className={`${styles} float-right border rounded my-4 px-3 py-2`}
      type="text"
      placeholder="Search products..."
      value={searchQuery}
      onChange={e => {
        onChange(e.target.value);
      }}
    />
  );
};

export default TableSearch;