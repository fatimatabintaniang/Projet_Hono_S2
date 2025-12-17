import {z} from 'zod';
export const matiereSchema = z.object({
    nom_matiere: z.string()
    .min(1 ,'Le nom de la matiere est obligatoire')
    .max(100, 'Le nom de la matiere ne doit pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Le nom de la matiere ne doit contenir que des lettres, espaces, tirets et apostrophes')
})
export const matiereCreateSchema = matiereSchema;
export const matiereUpdateSchema = matiereSchema.partial();