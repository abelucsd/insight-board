import { ICustomer, Customer, CreateCustomerInput } from "../models/customer";
import { createLogger } from "../utils/logger";
import { CustomError } from "../errors/CustomError";

const logger = createLogger('customer.service');


export const customerService = {
  createCustomer: async (customerData: CreateCustomerInput): Promise<ICustomer> => {
    try {
      logger.info(`[createCustomer] Creating customer with name: ${customerData.name}`);
      const newCustomer = await Customer.create(customerData);      
      logger.info(`[createCustomer] Customer created with ID: ${newCustomer._id}`);
      return newCustomer;
    } catch (error) {
      const err = new CustomError('Failed to create customer', 400);
      throw err;
    }
  },
  getCustomers: async(search: string, page: number, limit: number): Promise<{data: ICustomer[], total: number}>  => {
    try {
      logger.info(`[getCustomers] Returning customer(s).`);      

      const query = search
        ? { name: {$regex: search, $options: 'i'}}
        : {};              
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        Customer.find(query).skip(skip).limit(limit),
        Customer.countDocuments(query),
      ]);
      
      return { data, total };
    } catch (error) {
      const err = new CustomError('Failed to fetch customers', 500);
      throw err;
    }
  },
  getCustomerById: async (id: string): Promise<ICustomer | null> => {
    try {
      logger.info(`[getCustomerById] Fetching customer with ID: ${id}`);
      return await Customer.findById(id);
    } catch (error) {
      const err = new CustomError('Failed to fetch customer by ID', 404);      
      throw err;
    }
  },
  updateCustomer: async (id: string, customerData: Partial<CreateCustomerInput>): Promise<ICustomer | null> => {
    try {
      logger.info(`[updateCustomer] Updating customer with ID: ${id}`);
      return await Customer.findByIdAndUpdate(id, customerData, { new: true });
    } catch (error) {
      const err = new CustomError('Failed to update customer', 404);      
      throw err;
    }
  },
  deleteCustomer: async (id: string): Promise<ICustomer | null> => {
    try {
      logger.info(`[deleteCustomer] Deleting customer with ID: ${id}`);
      return await Customer.findByIdAndDelete(id);
    } catch (error) {
      const err = new CustomError('Failed to delete customer', 404);      
      throw err;
    }
  }
};