import { describe, it, expect, beforeEach } from '@jest/globals';
import { jest } from '@jest/globals';

import { productService } from '../src/services/product.service';
import { Product, IProduct, CreateProductInput } from '../src/models/product';

jest.mock('../src/models/product');

describe('Product Service', () => {

  describe('getProducts', () => {
    const mockedProducts: IProduct[] = [
      { _id: '1', name: 'Test Product 1', price: 10 }, 
      { _id: '2', name: 'Test Product 2', price: 20},
    ];

    // setup and teardown
    beforeEach(() => {
      jest.clearAllMocks();
    });


    it('should return an empty array when no items exist', async () => {
      (Product.find as jest.MockedFunction<typeof Product.find>).mockResolvedValue([]);
      
      const result = await productService.getProducts();    
      expect(result).toEqual([]);
      expect(Product.find).toHaveBeenCalledTimes(1);
    });

    it('should return all items', async () => {
      (Product.find as jest.MockedFunction<typeof Product.find>).mockResolvedValue(mockedProducts);
      
      const result = await productService.getProducts();    
      expect(result).toEqual(mockedProducts);
      expect(Product.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when fetching products fails', async () => {
      (Product.find as jest.MockedFunction<typeof Product.find>).mockRejectedValue(new Error('Database error'));
      
      await expect(productService.getProducts()).rejects.toThrow('Failed to fetch products');
      expect(Product.find).toHaveBeenCalledTimes(1);
    });
  });
});