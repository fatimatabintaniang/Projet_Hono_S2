import { z } from 'zod'

export const categorieSchema = z.object({
  nom: z.string().min(1, 'Le nom est obligatoire'),
})
