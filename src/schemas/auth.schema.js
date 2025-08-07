import { z } from 'zod'

const RoleEnum = z.enum(['ADMIN', 'ENSEIGNANT', 'ETUDIANT'])

export const registerSchema = z.object({
  prenom:     z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  nom:        z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  telephone:  z.string().max(9, 'Le téléphone doit avoir au maximum 9 chiffres').optional(),
  email:      z.string().email('Email invalide'),
  password:   z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  image:      z.string().url().optional(),
  role:       RoleEnum.optional(),  
})

export const loginSchema = z.object({
  email:      z.string().email('Email invalide'),
  password:   z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export const updateProfileSchema = z.object({
  prenom:     z.string().min(2).optional(),
  nom:        z.string().min(2).optional(),
  telephone:  z.string().max(9).optional(),  
  image:      z.string().url().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Mot de passe actuel requis'),
  newPassword:     z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères'),
})
