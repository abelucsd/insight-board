import { BehaviorType, LevelType } from "../../types/customerTrends";

interface TableLevelFilterProps {
  behavior: BehaviorType;
  handleClick: (behavior: BehaviorType, value: LevelType) => void;
}

const TableLevelFilter = ({behavior, handleClick}: TableLevelFilterProps) => {
  return (
    <div className="flex flex-row justify-end gap-2">
      <button className='btn-secondary' onClick={() => handleClick(behavior, 'high')}>High</button>
      <button className='btn-secondary' onClick={() => handleClick(behavior, 'normal')}>Normal</button>
      <button className='btn-secondary' onClick={() => handleClick(behavior, 'low')}>Low</button>
    </div>
  );
};

export default TableLevelFilter;