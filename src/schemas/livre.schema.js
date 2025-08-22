import { z } from 'zod'

export const livreSchema = z
  .object({
    titre: z.string().min(1, "Le titre est obligatoire"),
    auteur: z.string().min(1, "L'auteur est obligatoire"),
    format: z.string().min(1, "Le format est obligatoire"),
    chemin_fichier: z.string().url("Le chemin doit être une URL valide"),
    type: z.enum(["PDF", "EPUB", "MEMOIRE", "LIVRE_COURS"]),
    categorieId: z.number().int().positive(),
    niveauId: z.number().int().positive(),
    matiereId: z.number().int().positive(),
  })
  .strict()
