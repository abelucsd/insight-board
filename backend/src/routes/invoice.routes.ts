import express from 'express';
import { 
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceById,
  deleteInvoiceById
} from '../controllers/invoice.controller';

export const invoiceRouter = express.Router();

invoiceRouter.get('/', getInvoices);
invoiceRouter.post('/', createInvoice);
invoiceRouter.get('/:id', getInvoiceById);
invoiceRouter.put('/:id', updateInvoiceById);
invoiceRouter.delete('/:id', deleteInvoiceById);