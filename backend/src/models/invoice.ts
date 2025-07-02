import mongoose from 'mongoose';
const { Schema } = mongoose;


export interface IInvoiceItem {
  id: string;
  name: string;  
  salePrice: number;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
};

const itemSchema = new Schema<IInvoiceItem>({
  id: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },  
  salePrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  revenue: { type: Number, required: true },
  cost: { type: Number, required: true },
  profit: { type: Number, required: true },
}, { _id: false });

export interface CreateInvoiceInput {
  id: string;
  customer: string;
  date: string;
  location: string;  
  items: IInvoiceItem[];
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;  
};

export interface IInvoice extends CreateInvoiceInput {
  _id: string;
};

const invoiceSchema = new Schema<IInvoice>({
  id: { type: String, required: true},  
  customer: { type: String, required: true},
  date: { type: String, required: true},
  location: { type: String, required: true},
  items: { type: [itemSchema], required: true},      
  totalRevenue: { type: Number, required: true},
  totalCost:{ type: Number, required: true},
  totalProfit: { type: Number, required: true},  
});

// export let invoices: Invoice[] = [];

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema, "invoices");