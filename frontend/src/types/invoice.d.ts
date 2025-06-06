export type Invoice = {
  _id: string;
  customer: string;
  itemName: string;
  itemNumber: number;  
  price: number;
  date: string;
  quantity: number;
  revenue: number;
  totalCost: number;
  profit: number;
  location: string;
};