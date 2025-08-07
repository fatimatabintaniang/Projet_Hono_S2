import { Hono } from 'hono'
import { authMiddleware } from '../middlewares/auth.js'
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js'


export const productRoutes = new Hono()
  .use(authMiddleware)
  .post('/', createProduct)
  .get('/', getProducts)
  .get('/:id', getProduct)
  .patch('/:id', updateProduct)
  .delete('/:id', deleteProduct)
