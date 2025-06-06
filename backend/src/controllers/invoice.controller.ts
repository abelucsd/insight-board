import { NextFunction, Request, Response } from 'express';
import { invoiceService } from '../services/invoice.service';


export const createInvoice = async(
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const response = await invoiceService.createInvoice(req.body);    
    res.status(201).json({
      message: 'Created invoice successfully',
      data: response
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoices = async(
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {
    const search = req.query.search as string || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;    

    const { data, total } = await invoiceService.getInvoices(search, page, limit);
    
    res.status(200).json({
      message: 'Retrieved invoices successfully',
      data: { data, total }
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async(
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const invoiceId = req.params.id;
    const response = await invoiceService.getInvoiceById(invoiceId);
    if (!response) {
      res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json({
      message: 'Retrieved invoice by ID successfully',
      data: response
    });   
  } catch (error) {
    next(error);
  }
};

export const updateInvoiceById = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const invoiceId = req.params.id;
    const response = await invoiceService.updateInvoiceById(invoiceId, req.body);
    if (!response) {
      res.status(404).json({ message: 'Invoice not found'});
    }
    res.status(200).json({
      message: 'Updated invoice by ID successfully',
      data: response
    });   
  } catch (error) {
    next(error);
  }
};

export const deleteInvoiceById = async (
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {
    const invoiceId = req.params.id;
    const response = await invoiceService.deleteInvoiceById(invoiceId);
    if (!response) {
      res.status(404).json({ message: 'Invoice not found'});
    }
    res.status(200).json({
      message: 'Deleted invoice by ID successfully',
      data: response
    });   
  } catch (error) {
    next(error);
  }
};