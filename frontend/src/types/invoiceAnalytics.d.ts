export interface TopProducts {
  "Item Name": string;
  "Quantity Sold": number;
};

export interface RawTopData {
  attribute: string;
  count: number;
};

export interface TopLocations {
  "Location": string;
  "Sales": number;
};

export interface MonthlyData {
  total: number;
  month: string;
  year: string;
};

export interface CurrMonthData {
  total: number;
  growth: number;
};