import { z } from 'zod'


export const registerSchema = z.object({
  prenom:  z.string().min(2),
  nom:     z.string().min(2),
  adresse: z.string().min(5),
  email:   z.string().email(),
  password:z.string().min(6),
})


export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
})
