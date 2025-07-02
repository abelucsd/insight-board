export type Invoice = {
  _id: string;
  id: string;
  customer: string;
  itemName: string;
  itemNumber: number;  
  price: number;
  date: string;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
  location: string;
};