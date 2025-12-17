import {Hono} from 'hono'
import {authMiddleware} from '../middlewares/auth.js'
import { createNiveau,getNiveaux,getNiveauById,updateNiveau,deleteNiveau } from '../controllers/niveau.controller.js'

export const niveauRoutes = new Hono()
.use(authMiddleware)
.get('/',getNiveaux)
.post('/',createNiveau)
.get('/:id',getNiveauById)
.patch('/:id',updateNiveau)
.delete('/:id',deleteNiveau)