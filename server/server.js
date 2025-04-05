import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectToMongoDB from './configs/mongodb.js'
import { ClerkWebHooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoute.js'
import { clerkMiddleware } from '@clerk/express'
import connectToCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/UserRoute.js'
const app = express()

// middlewares
app.use(cors())
app.use(clerkMiddleware())
// connect to the database 
connectToMongoDB()
// connect to cloudibary
connectToCloudinary()
// Routes
app.get('/', (req, res) => res.send("api Success"))
app.post('/clerk', express.json(),ClerkWebHooks)
app.use('/api/educator', express.json(),educatorRouter)
app.use('/api/course', express.json(),courseRouter)
app.use('/api/user',express.json(), userRouter)
app.post('/stripe',express.raw({type: 'application/json'}),stripeWebhooks)





const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

