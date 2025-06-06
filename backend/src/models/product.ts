import mongoose from 'mongoose';
const { Schema } = mongoose;

// in memory stub
export let products: IProduct[] = [];

export interface CreateProductInput {
  name: string;
  price: number;  
  description?: string;
}

export interface IProduct extends CreateProductInput{
  _id: string;
};

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: false },
});

export const Product = mongoose.model<IProduct>('Product', productSchema);