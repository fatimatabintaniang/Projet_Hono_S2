import { Hono } from 'hono'
import { register, login } from '../controllers/auth.controller.js'


export const authRoutes = new Hono()
  .post('/register', register)
  .post('/login', login)