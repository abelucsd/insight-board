import axios from 'axios';
import { CreateProductInput } from "../schemas/productSchema";
import { API_URL } from '../utils/data';

export async function createProduct(data: CreateProductInput) {
  try {
    const response = await axios.post(
      `${API_URL}/products/`,
      data,
    );
        
    return response.data;
  } catch (error) {
    throw error;
  };
};