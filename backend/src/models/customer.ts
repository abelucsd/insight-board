import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface CreateCustomerInput {
  id: string;
  name: string;
  number: number;
  address: string;
  email: string;
};

export interface ICustomer extends CreateCustomerInput {
  _id: string;
};

const customerSchema = new Schema<ICustomer>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  number: { type: Number },
  address: { type: String },
  email: { type: String },
});

export const Customer = mongoose.model<ICustomer>('Customer', customerSchema);