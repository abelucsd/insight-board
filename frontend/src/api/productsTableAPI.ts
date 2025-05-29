import axios from 'axios';
import { API_URL } from '../utils/data';
import { Product } from '../types/products';

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(
    `${API_URL}/products/`
  );
  
  return response.data;
};