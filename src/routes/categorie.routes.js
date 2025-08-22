import { Hono } from 'hono'
import { authMiddleware } from '../middlewares/auth.js'
import {
  createCategorie,
  getCategories,
  getCategorie,
  updateCategorie,
  deleteCategorie,
} from '../controllers/categorie.controller.js'

export const categorieRoutes = new Hono()
  .use(authMiddleware)
  .post('/', createCategorie)
  .get('/', getCategories)
  .get('/:id', getCategorie)
  .patch('/:id', updateCategorie)
  .delete('/:id', deleteCategorie)







  
