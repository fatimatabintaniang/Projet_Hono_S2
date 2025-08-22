import { Hono } from 'hono'
import { authMiddleware } from '../middlewares/auth.js'
import {
  createLivre,
  getLivres,
  getLivre,
  updateLivre,
  deleteLivre,
} from '../controllers/livre.controller.js'

export const livreRoutes = new Hono()
  .use(authMiddleware) // protégé par auth
  .post('/', createLivre)
  .get('/', getLivres)
  .get('/:id', getLivre)
  .patch('/:id', updateLivre)
  .delete('/:id', deleteLivre)
