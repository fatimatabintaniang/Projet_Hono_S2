import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'


import { authRoutes }    from './routes/auth.routes.js'
import { productRoutes } from './routes/product.routes.js'
import swaggerStaticApp  from './swagger-static.js'  // ← la nouvelle sous‑app


export const app = new Hono()
  .use('*', logger())
  .use('*', cors())


/* --------- Sous‑apps --------- */
app.route('/auth',     authRoutes)
app.route('/products', productRoutes)
app.route('/docs',     swaggerStaticApp)   


/* --------- Endpoints simples --------- */
app.get('/test', (c) => c.json({ ok: true }))
app.get('/',     (c) => c.text('API up ✔️'))
