import { Request, Response } from 'express';
import { 
  getProducts, 
  createProduct, 
  getProductById, 
  updateProduct, 
  deleteProduct
} from '../../src/controllers/product.controller';
import { productService } from '../../src/services/product.service';
import { products, Product, IProduct } from '../../src/models/product';
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


  describe('Create Product', () => {
    it('should create a product and return it', async () => {
      const newProduct = { name: 'Product 1', price: 10 };
      const createdProduct = { _id: '1', ...newProduct };

      jest.spyOn(productService, 'createProduct').mockResolvedValue(createdProduct as IProduct);
      req.body = newProduct; // Mock request body

      await createProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdProduct);
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      req.body = { name: 'Product 1', price: 10 }; // Mock request body

      jest.spyOn(productService, 'createProduct').mockRejectedValue(mockError);

      await createProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 201 status code', async () => {
      const newProduct = { name: 'Product 1', price: 10 };
      const createdProduct = { _id: '1', ...newProduct };

      jest.spyOn(productService, 'createProduct').mockResolvedValue(createdProduct as IProduct);
      req.body = newProduct; // Mock request body

      await createProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);      
      expect(res.json).toHaveBeenCalled();
    });   
  });


  describe('Get Products', () => {

    it('should return an empty array when no items exist', async () => {  
      const mockProducts = {data: [], total: 0};
      jest.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);  

      req = {
        query: { search: '', page: '1', limit: '10' },
      } as any;
      
      await getProducts(req, res, next);
      
      expect(res.json).toHaveBeenCalledWith({data: [], total: 0});
    });

    it('should return all products', async () => {
      // Mock Service with sample data
      const products = [
        { _id: '1', name: 'Product 1', price: 10 },
        { _id: '2', name: 'Product 2', price: 20 },
      ];
      const mockProducts = {data: products, total: 2};

      jest.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);

      req = {
        query: { search: '', page: '1', limit: '10' },
      } as any;
      
      await getProducts(req, res, jest.fn());
      
      expect(res.json).toHaveBeenCalledWith(mockProducts);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      req = {        
        query: { search: '', page: '1', limit: '10'},
      } as any;
    
      jest.spyOn(productService, 'getProducts').mockRejectedValue(mockError);    
    
      await getProducts(req, res, next);
    
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 200 status code', async () => {
      const products = [
        { _id: '1', name: 'Product 1', price: 10 },
        { _id: '2', name: 'Product 2', price: 20 },
      ];
      const mockProducts = {data: products, total: 2};
      jest.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts);

      req = {
        query: { search: '', page: '1', limit: '100'}
      } as any;
    
      await getProducts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);      
      expect(res.json).toHaveBeenCalled();
    });
  });


  describe('Get Product By ID', () => {
    it('should return a product by ID', async () => {
      const productId = '123';
      const product = { _id: productId, name: 'Product 1', price: 10 };

      jest.spyOn(productService, 'getProductById').mockResolvedValue(product);
      req.params = { id: productId };
      await getProductById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(product);
    });

    it('should return 404 if product not found', async () => {
      const productId = '124';
      jest.spyOn(productService, 'getProductById').mockResolvedValue(null);
      req.params = { id: productId };

      await getProductById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');     
      req.params = { id: '1' }
    
      jest.spyOn(productService, 'getProductById').mockRejectedValue(mockError);

      await getProductById(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });


  describe('Update Product', () => {  
    it('should update a product and return it', async () => {
      const productId = '123';
      const updatedProduct = { name: 'Updated Product', price: 20 };
      const productInDb = { _id: productId, ...updatedProduct };

      jest.spyOn(productService, 'updateProduct').mockResolvedValue(productInDb as IProduct);
      req.params = { id: productId }; // Mock request params
      req.body = updatedProduct; // Mock request body

      await updateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(productInDb);
    });

    it('should return 404 if product not found', async () => {
      const productId = '124';
      jest.spyOn(productService, 'updateProduct').mockResolvedValue(null);
      req.params = { id: productId };
      req.body = { name: 'Updated Product', price: 20 };

      await updateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      req.params = { id: '1' };
      req.body = { name: 'Updated Product', price: 20 };

      jest.spyOn(productService, 'updateProduct').mockRejectedValue(mockError);

      await updateProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });


  describe('Delete Product', () => {
    it('should delete a product and return it', async () => {
      const productId = '123';
      const deletedProduct = { _id: productId, name: 'Product 1', price: 10 };

      jest.spyOn(productService, 'deleteProduct').mockResolvedValue(deletedProduct as IProduct);
      req.params = { id: productId };

      await deleteProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletedProduct);
    });

    it('should return 404 if product not found', async () => {
      const productId = '124';
      jest.spyOn(productService, 'deleteProduct').mockResolvedValue(null);
      req.params = { id: productId };

      await deleteProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      req.params = { id: '1' };

      jest.spyOn(productService, 'deleteProduct').mockRejectedValue(mockError);

      await deleteProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
