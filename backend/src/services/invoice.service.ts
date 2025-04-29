import { IInvoice, Invoice, CreateInvoiceInput } from "../models/invoice";
import { createLogger } from "../utils/logger";
import { CustomError } from "../errors/CustomError";

const logger = createLogger('invoice.service');

const createInvoice = async(invoice: CreateInvoiceInput): Promise<IInvoice> => {
  try {
    logger.info(`[createInvoice] Creating invoice for customer: ${invoice.customer}`);
    const newInvoice = await Invoice.create(invoice);
    logger.info(`[createInvoice] Invoice created with id: ${newInvoice._id}`);
    return newInvoice;
  } catch (error) {
    const err = new CustomError('Failed to create the invoice', 400);
    logger.error(`[createInvoice] Error creating the invoice: ${err.message}`);
    throw(err);
  }
};

const getInvoices = async(): Promise<IInvoice[]> => {
  try {
    return await Invoice.find({});
  } catch (error) {
    const err = new CustomError('Failed to fetch Invoices', 500);
    logger.error(`[getInvoices] Error fetching invoices: ${err.message}`)
    throw(err);
  } 
};

export const invoiceService = {
  createInvoice,
  getInvoices,
};