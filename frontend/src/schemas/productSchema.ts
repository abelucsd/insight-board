import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  description: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;