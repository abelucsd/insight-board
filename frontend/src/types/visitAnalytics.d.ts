export interface VisitData {
  timestamp: Date;
};

export interface VisitResponse {
  message: string;
  data: VisitData;
};

export interface CurrMonthData {
  total: number;
  growth: number;
};