import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import dotenv from 'dotenv'
import scrappingInstance from './routes/srapping-route.js'
import chatInstance from './routes/chat-routes.js'

dotenv.config()

const app = new Hono()
const port = process.env.PORT 

// console.log(port)

app.use('*', logger())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))


app.route('/', chatInstance)
app.route('/', scrappingInstance)

// app.get('/', (c) => {
//   return c.text('Hello World!')
// })



//for error (middleware)
app.onError((err, c) => {
  console.error(err)
  return c.text('Something broke!', 500)
})

serve({
  fetch: app.fetch,
  port: port
}, () => {
  console.log(`Server is running on port ${port}`)
})

