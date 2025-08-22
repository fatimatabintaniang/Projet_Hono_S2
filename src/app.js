import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'


import { authRoutes }    from './routes/auth.routes.js'
import { livreRoutes }   from './routes/livre.routes.js'
import { categorieRoutes } from './routes/categorie.routes.js'
import swaggerStaticApp  from './swagger-static.js' 


export const app = new Hono()
  .use('*', logger())
  .use('*', cors())


/* --------- Sous‑apps --------- */
app.route('/auth',     authRoutes)
app.route('/docs',     swaggerStaticApp)
app.route('/livres',   livreRoutes)
app.route('/categories', categorieRoutes)



/* --------- Endpoints simples --------- */
app.get('/test', (c) => c.json({ ok: true }))
app.get('/',     (c) => c.text('API up ✔️'))
