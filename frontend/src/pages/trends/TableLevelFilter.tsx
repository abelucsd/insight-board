import { BehaviorType, LevelType } from "../../types/customerTrends";

interface TableLevelFilterProps {
  behavior: BehaviorType;
  activeLevel: LevelType;
  handleClick: (behavior: BehaviorType, value: LevelType) => void;  
};

const TableLevelFilter = ({behavior, activeLevel, handleClick}: TableLevelFilterProps) => {  
  return (
    <div className="flex flex-row justify-end gap-2">
      <button className={` ${activeLevel === 'high' ? 'btn-secondary active' : 'btn-secondary'}`} onClick={() => handleClick(behavior, 'high')}>High</button>
      <button className={` ${activeLevel === 'normal' ? 'btn-secondary active' : 'btn-secondary'}`} onClick={() => handleClick(behavior, 'normal')}>Normal</button>
      <button className={` ${activeLevel === 'low' ? 'btn-secondary active' : 'btn-secondary'}`} onClick={() => handleClick(behavior, 'low')}>Low</button>
    </div>
  );
};

export default TableLevelFilter;