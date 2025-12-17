import { z } from 'zod'

export const categorieSchema = z.object({
  nom: z.string()
    .min(1, 'Le nom est obligatoire')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Le nom ne doit contenir que des lettres, espaces, tirets et apostrophes')
})

export const categorieCreateSchema = categorieSchema
export const categorieUpdateSchema = categorieSchema.partial()