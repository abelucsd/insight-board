import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface CreateInvoiceInput {
  id: string
  customer: string;
  itemName: string;
  itemNumber: string;  
  price: number;
  date: string;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
  location: string;
};

export interface IInvoice extends CreateInvoiceInput {
  _id: string;
};

const invoiceSchema = new Schema<IInvoice>({
  id: { type: String, required: true},
  customer: { type: String, required: true},
  itemName: { type: String, required: true},
  itemNumber:{ type: String, required: true},
  price: { type: Number, required: true},
  date: { type: String, required: true},
  quantity: { type: Number, required: true},
  revenue: { type: Number, required: true},
  cost:{ type: Number, required: true},
  profit: { type: Number, required: true},
  location: { type: String, required: true},
});

// export let invoices: Invoice[] = [];

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema, "invoices");