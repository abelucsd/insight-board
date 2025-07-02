import { z } from 'zod';

export const createProductSchema = z.object({
  id: z.string().min(2, 'Id is required'),
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(3, 'Category is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  salePrice: z.coerce.number().min(0, 'Sale Price must be positive'),
  cost: z.coerce.number().min(0, 'cost must be positive'),
  description: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;