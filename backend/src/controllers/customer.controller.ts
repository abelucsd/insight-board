import { Request, Response, NextFunction } from 'express';
import { customerService } from '../services/customer.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('customer.controller');

export const createCustomer = async( req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('[createCustomer] Received request to create a new customer.');

    const { id, name, number, address, email } = req.body;
    const newCustomer = await customerService.createCustomer({ id, name, number, address, email });

    logger.info(`[createProduct] Successfully created customer with ID: ${newCustomer._id}`);
    res.status(201).json(newCustomer);
  } catch (error) {    
    next(error);
  }
};

export const getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('[getCustomers] Received request to get all customer.');

    const search = req.query.search as string || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;    

    const { data, total } = await customerService.getCustomers(search, page, limit);

    logger.info(`[getCustomer] Successfully fetched customer(s).`);
    res.status(200).json({ data, total });    
  } catch (error) {        
    next(error);
  }  
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customerId = req.params.id;
    const customer = await customerService.getCustomerById(customerId);
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customerId = req.params.id;
    const updatedCustomer = await customerService.updateCustomer(customerId, req.body);
    if (!updatedCustomer) {
      res.status(404).json({ message: 'Customer not found' });
    }    

    res.status(200).json(updatedCustomer);
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customerId = req.params.id;
    const deletedCustomer = await customerService.deleteCustomer(customerId);
    if (!deletedCustomer) {
      res.status(404).json({ message: 'Customer not found' });
    }    

    res.status(200).json(deletedCustomer);
  } catch (error) {
    next(error);
  }
};