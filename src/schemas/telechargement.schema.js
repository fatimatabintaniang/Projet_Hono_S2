import {z} from 'zod';
export const telechargementSchema = z.object({
  userId: z.coerce.number(),
  livreId: z.coerce.number(),
})
