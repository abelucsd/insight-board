export interface MonthlyData {
  month: string, 
  total: number
};

export interface CurrentMonthGrowthData {
  total: number,
  growth: number;
};

export interface TopAttributeData {
  attribute: string;
  count: number;
};
