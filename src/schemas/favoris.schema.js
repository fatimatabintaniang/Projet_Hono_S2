import {z} from 'zod';

export const favoriSchema = z.object({
  id: z.number().int().positive().optional(),
  a_lire_plus_tard: z.boolean().default(false),
  userId: z.number().int().positive(),
  livreId: z.number().int().positive(),
});
