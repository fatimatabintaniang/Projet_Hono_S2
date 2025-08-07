import { z } from 'zod'


export const productSchema = z
  .object({
    label: z.string().min(1),
    price: z.number().positive(),
    quantity: z.number().int().nonnegative(),
  })
  .strict()
