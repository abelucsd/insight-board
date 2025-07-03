import { Request, Response } from 'express';
import { 
  getCustomers, 
  createCustomer, 
  getCustomerById, 
  updateCustomer, 
  deleteCustomer
} from '../../src/controllers/customer.controller';
import { customerService } from '../../src/services/customer.service';
import { CreateCustomerInput, Customer, ICustomer } from '../../src/models/customer';
import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Customer Controller', () => {
  let mockCustomers: CreateCustomerInput[] = [
    {
      id: 'cust-01',
      name: 'Foo Bar',
      number: 9999999999,
      address: 'USA',
      email: 'foobar@email.com',      
    },
    {
      id: 'cust-02',
      name: 'Test Name',
      number: 9999999998,
      address: 'USA',
      email: 'testname@email.com',
    }
  ];
  let req: Request;
  let res: Response;
  let next: jest.Mock;  

  // setup and teardown
  beforeEach(() => {        

    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    next = jest.fn();
  });


  describe('Create Customer', () => {
    it('should create a Customer and return it', async () => {
      const newCustomer = mockCustomers[0];
      const createdCustomer = { _id: '1', ...newCustomer };

      jest.spyOn(customerService, 'createCustomer').mockResolvedValue(createdCustomer as ICustomer);
      req.body = newCustomer; // Mock request body

      await createCustomer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdCustomer);
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      req.body = { name: 'Customer 1', price: 10 }; // Mock request body

      jest.spyOn(customerService, 'createCustomer').mockRejectedValue(mockError);

      await createCustomer(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 201 status code', async () => {
      const newCustomer = mockCustomers[0];
      const createdCustomer = { _id: '1', ...newCustomer };

      jest.spyOn(customerService, 'createCustomer').mockResolvedValue(createdCustomer as ICustomer);
      req.body = newCustomer; // Mock request body

      await createCustomer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);      
      expect(res.json).toHaveBeenCalled();
    });   
  });


  describe('Get Customers', () => {

    it('should return an empty array when no items exist', async () => {  
      const newCustomers = {data: [], total: 0};
      jest.spyOn(customerService, 'getCustomers').mockResolvedValue(newCustomers);  

      req = {
        query: { search: '', page: '1', limit: '10' },
      } as any;
      
      await getCustomers(req, res, next);
      
      expect(res.json).toHaveBeenCalledWith({data: [], total: 0});
    });

    it('should return all Customers', async () => {
      // Mock Service with sample data
      const customers = [
        { _id: '1', ...mockCustomers[0]},
        { _id: '2', ...mockCustomers[1]},
      ];
      const mockData = {data: customers, total: 2};

      jest.spyOn(customerService, 'getCustomers').mockResolvedValue(mockData);

      req = {
        query: { search: '', page: '1', limit: '10' },
      } as any;
      
      await getCustomers(req, res, jest.fn());
      
      expect(res.json).toHaveBeenCalledWith(mockData);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      req = {        
        query: { search: '', page: '1', limit: '10'},
      } as any;
    
      jest.spyOn(customerService, 'getCustomers').mockRejectedValue(mockError);    
    
      await getCustomers(req, res, next);
    
      expect(next).toHaveBeenCalledWith(mockError);
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 200 status code', async () => {
      const customers = [
        { _id: '1', ...mockCustomers[0]},
        { _id: '2', ...mockCustomers[1]},
      ];
      const mockData = {data: customers, total: 2};
      jest.spyOn(customerService, 'getCustomers').mockResolvedValue(mockData);

      req = {
        query: { search: '', page: '1', limit: '100'}
      } as any;
    
      await getCustomers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);      
      expect(res.json).toHaveBeenCalled();
    });
  });


  describe('Get Customer By ID', () => {
    it('should return a Customer by ID', async () => {
      const customerId = '123';
      const customer = { _id: customerId, ...mockCustomers[0]};

      jest.spyOn(customerService, 'getCustomerById').mockResolvedValue(customer);
      req.params = { id: customerId };
      await getCustomerById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(customer);
    });

    it('should return 404 if Customer not found', async () => {
      const customerId = '124';
      jest.spyOn(customerService, 'getCustomerById').mockResolvedValue(null);
      req.params = { id: customerId };

      await getCustomerById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Customer not found' });
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');     
      req.params = { id: '1' }
    
      jest.spyOn(customerService, 'getCustomerById').mockRejectedValue(mockError);

      await getCustomerById(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });


  describe('Update Customer', () => {  
    it('should update a Customer and return it', async () => {
      const customerId = '123';
      const updatedCustomer = mockCustomers[0];
      const customerInDb = { _id: customerId, ...updatedCustomer };

      jest.spyOn(customerService, 'updateCustomer').mockResolvedValue(customerInDb as ICustomer);
      req.params = { id: customerId }; // Mock request params
      req.body = updatedCustomer; // Mock request body

      await updateCustomer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(customerInDb);
    });

    it('should return 404 if Customer not found', async () => {
      const customerId = '124';
      jest.spyOn(customerService, 'updateCustomer').mockResolvedValue(null);
      req.params = { id: customerId };
      req.body = mockCustomers[0];

      await updateCustomer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Customer not found' });
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      req.params = { id: '1' };
      req.body = { name: 'Updated Customer', price: 20 };

      jest.spyOn(customerService, 'updateCustomer').mockRejectedValue(mockError);

      await updateCustomer(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });


  describe('Delete Customer', () => {
    it('should delete a Customer and return it', async () => {
      const customerId = '123';
      const deletedCustomer = { _id: customerId, ...mockCustomers[0] };

      jest.spyOn(customerService, 'deleteCustomer').mockResolvedValue(deletedCustomer as ICustomer);
      req.params = { id: customerId };

      await deleteCustomer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deletedCustomer);
    });

    it('should return 404 if Customer not found', async () => {
      const customerId = '124';
      jest.spyOn(customerService, 'deleteCustomer').mockResolvedValue(null);
      req.params = { id: customerId };

      await deleteCustomer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Customer not found' });
    });

    it('should call next with an error if service throws', async () => {
      const mockError = new Error('Database failure');
      req.params = { id: '1' };

      jest.spyOn(customerService, 'deleteCustomer').mockRejectedValue(mockError);

      await deleteCustomer(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
