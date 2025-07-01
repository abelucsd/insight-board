import mongoose from 'mongoose';
const { Schema } = mongoose;

// in memory stub
export let products: IProduct[] = [];

export interface CreateProductInput {
  id: string;
  name: string;
  category: string;  
  price: number;
  salePrice: number;
  cost: number;
  description?: string;
}

export interface IProduct extends CreateProductInput{
  _id: string;
};

const productSchema = new Schema<IProduct>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },    
  salePrice: { type: Number, required: true},
  cost: { type: Number, required: true},
  description: { type: String, required: false },
});

export const Product = mongoose.model<IProduct>('Product', productSchema);