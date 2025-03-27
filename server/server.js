import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectToMongoDB from './configs/mongodb.js'
import { ClerkWebHooks } from './controllers/webhooks.js'
const app = express()
app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 8000
// connect to the database 
connectToMongoDB()
//
app.get('/',(req,res) => {
res.send("api Success")
})
app.post('/clerk',ClerkWebHooks)
app.listen(PORT,() => console.log(`Listening on port ${PORT}`))
 // sabdelrahman071  03gEYNNW5acZrDrP