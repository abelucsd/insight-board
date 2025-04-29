import express from 'express';
import { 
  createInvoice,
  getInvoices,
  getInvoiceById,
} from '../controllers/invoice.controller';

export const invoiceRouter = express.Router();

invoiceRouter.get('/', getInvoices);
invoiceRouter.post('/', createInvoice);
invoiceRouter.get('/:id', getInvoiceById);