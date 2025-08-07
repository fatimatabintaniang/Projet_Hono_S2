import { serve } from '@hono/node-server'
import { env } from './config/env.js'
import { app } from './app.js'


serve({ fetch: app.fetch, port: Number(env.PORT) })
console.log(`🚀 Server ready at http://localhost:${env.PORT}`)
