import express from 'express';
import { 
  createInvoice,
  getInvoices 
} from '../controllers/invoice.controller';

export const invoiceRouter = express.Router();

invoiceRouter.get('/', getInvoices);
invoiceRouter.post('/', createInvoice);