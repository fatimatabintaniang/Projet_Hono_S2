import { Hono } from 'hono'
import { authMiddleware } from '../middlewares/auth.js'
import {
    createTelechargement,
    getTelechargements,
    getTelechargementById,
    updateTelechargement,
    deleteTelechargement
} from '../controllers/telechargement.controller.js'
export const telechargementRoutes = new Hono()
    .use(authMiddleware)
    .post('/', createTelechargement)
    .get('/', getTelechargements)
    .get('/:id', getTelechargementById)
    .patch('/:id', updateTelechargement)
    .delete('/:id', deleteTelechargement)