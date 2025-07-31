import express from 'express';
import { 
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} from '../controllers/customer.controller';

export const customerRouter = express.Router();

customerRouter.get('/', getCustomers);
customerRouter.post('/', createCustomer);
customerRouter.get('/:id', getCustomerById);
customerRouter.put('/:id', updateCustomer);
customerRouter.delete('/:id', deleteCustomer);