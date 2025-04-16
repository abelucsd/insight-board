import mongoose from 'mongoose';
const { Schema } = mongoose;

// in memory stub
export let products: IProduct[] = [];

export interface IProduct {  
  _id: string;
  name: string;
  price: number;
};

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

export const Product = mongoose.model('Product', productSchema);