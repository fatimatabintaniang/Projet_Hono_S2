import {z} from 'zod';
export const niveauSchema = z.object({
    libelle: z.string()
    .min(1 ,'Le libellé est obligatoire')
    .max(50, 'Le libellé ne doit pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-']+$/, 'Le libellé ne doit contenir que des lettres, chiffres, espaces, tirets et apostrophes')
})
export const niveauCreateSchema = niveauSchema;
export const niveauUpdateSchema = niveauSchema.partial();