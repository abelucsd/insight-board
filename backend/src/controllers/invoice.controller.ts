import { NextFunction, Request, Response } from 'express';
import { invoiceService } from '../services/invoice.service';


export const createInvoice = async(
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const response = await invoiceService.createInvoice(req.body);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getInvoices = async(
  req: Request, res: Response, next: NextFunction
) : Promise<void> => {
  try {
    const response = await invoiceService.getInvoices();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

