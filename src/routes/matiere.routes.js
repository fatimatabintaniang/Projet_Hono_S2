import {Hono} from 'hono'
import {authMiddleware} from '../middlewares/auth.js'
import { createMatiere,getMatieres,getMatiereById,updateMatiere,deleteMatiere } from '../controllers/matiere.controller.js'

export const matiereRoutes = new Hono()
.use(authMiddleware)
.get('/',getMatieres)
.post('/',createMatiere)
.get('/:id',getMatiereById)
.patch('/:id',updateMatiere)
.delete('/:id',deleteMatiere)