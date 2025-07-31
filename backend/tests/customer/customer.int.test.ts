import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { jest } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { Customer, CreateCustomerInput, ICustomer } from '../../src/models/customer';
import { customerService } from '../../src/services/customer.service';


describe('Customers Integration', () => {
  let mongoServer: MongoMemoryServer;

  const mockCustomers: CreateCustomerInput[] = [
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

  // setup and teardown
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Customer.deleteMany({});
  });


  describe('create Customer', () => {
    it('should create a new Customer', async () => {
      const newCustomer = { ...mockCustomers[0] };
      
      const result = await customerService.createCustomer(newCustomer);
      expect(result.name).toBe(newCustomer.name);
      expect(result.email).toBe(newCustomer.email);
    });

    it('should throw an error when creating a Customer fails', async () => {
      const newCustomer = { ...mockCustomers[0] };
      newCustomer.name = '';
      await expect(customerService.createCustomer(newCustomer)).rejects.toThrow('Failed to create customer');
    });
  });
  

  describe('get Customers', () => {
    it('should return an empty array when no Customers exist', async () => {
      const result = await customerService.getCustomers('', 1, 10);
      expect(result).toEqual({data: [], total: 0});
    });

    it('should return a list of Customers', async () => {

      for (const customer of mockCustomers) {
        await Customer.create(customer);
      }
      
      const {data, total} = await customerService.getCustomers('', 1, 100);      
      
      for (const [field, value] of Object.entries(mockCustomers[0])) {
        expect(data[0][field as keyof ICustomer]).toBe(value);
      }
    });
  });

  describe('get Customer by id', () => {
    it('should return a Customer by ID', async () => {
      const newCustomer = await Customer.create({ ...mockCustomers[0] });
      
      const result = await customerService.getCustomerById(newCustomer._id);
      expect(result!.name).toBe(newCustomer.name);
      expect(result!.email).toBe(newCustomer.email);
    });

    it('should throw an error when Customer not found', async () => {
      await expect(customerService.getCustomerById('invalid-id')).rejects.toThrow('Failed to fetch customer by ID');
    });
  });


  describe('update Customer', () => {
    it('should update a Customer', async () => {
      const newCustomer = await Customer.create({ ...mockCustomers[0] });
      const updatedCustomer = await customerService.updateCustomer(newCustomer._id, { email: 'email@email.com' });
      expect(updatedCustomer!.email).toBe('email@email.com');
    });

    it('should throw an error when updating a Customer fails', async () => {
      await expect(customerService.updateCustomer('invalid-id', { email: 'email@email.com' })).rejects.toThrow('Failed to update customer');
    });
  });


  describe('delete Customer', () => {
    it('should delete a Customer', async () => {
      const newCustomer = await Customer.create({ ...mockCustomers[0] });      
      const deletedCustomer = await customerService.deleteCustomer(newCustomer._id);
      expect(deletedCustomer!.name).toBe(newCustomer.name);
    });

    it('should throw an error when deleting a Customer fails', async () => {
      await expect(customerService.deleteCustomer('invalid-id')).rejects.toThrow('Failed to delete customer');
    });
  });
});