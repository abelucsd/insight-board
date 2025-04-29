import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface CreateInvoiceInput {
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

export interface IInvoice extends CreateInvoiceInput {
  _id: string;
};

const invoiceSchema = new Schema<IInvoice>({
  customer: { type: String, required: true},
  itemName: { type: String, required: true},
  itemNumber:{ type: Number, required: true},
  price: { type: Number, required: true},
  date: { type: String, required: true},
  quantity: { type: Number, required: true},
  revenue: { type: Number, required: true},
  totalCost:{ type: Number, required: true},
  profit: { type: Number, required: true},
  location: { type: String, required: true},
});

// export let invoices: Invoice[] = [];

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);