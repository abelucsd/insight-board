import { Request, Response } from 'express';
import { getProducts } from '../src/controllers/product.controller';
import { productService } from '../src/services/product.service';
import { products, Product, IProduct } from '../src/models/product';
import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Product Controller', () => {
  let mockProducts: IProduct[] = [];
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  // setup and teardown
  beforeEach(() => {    
    mockProducts = [];

    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    next = jest.fn();
  });

  it('should return an empty array when no items exist', async () => {  
    
    jest.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);  
    
    await getProducts(req, res, next);
    
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should return all products', async () => {
    // Mock Service with sample data
    mockProducts = [
      { _id: '1', name: 'Product 1', price: 10 },
      { _id: '2', name: 'Product 2', price: 20 },
    ];

    jest.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);
    
    await getProducts(req, res, jest.fn());
    
    expect(res.json).toHaveBeenCalledWith(mockProducts);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should call next with an error if service throws', async () => {
    const mockError = new Error('Database failure');
  
    jest.spyOn(productService, 'getProducts').mockRejectedValue(mockError);    
  
    await getProducts(req, res, next);
  
    expect(next).toHaveBeenCalledWith(mockError);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 200 status code', async () => {
    jest.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);
   
    await getProducts(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);      
    expect(res.json).toHaveBeenCalled();
  });
  

});
