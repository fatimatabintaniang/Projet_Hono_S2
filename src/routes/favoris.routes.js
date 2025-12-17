import { Hono } from 'hono'
import { authMiddleware } from '../middlewares/auth.js'

import {
    getFavoris,
    addFavori,
    getFavorisByUser,
    deleteFavori,
    updateFavori
} from '../controllers/favoris.controller.js'
export const favorisRoutes = new Hono()
    .use(authMiddleware)
    .get('/', getFavoris)
    .post('/', addFavori)
    .get('/user/:userId', getFavorisByUser)
    .delete('/:id', deleteFavori)
    .patch('/:id', updateFavori)