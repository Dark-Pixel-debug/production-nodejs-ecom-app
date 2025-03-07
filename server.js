import express from 'express'
import colors from 'colors'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import { connect } from 'mongoose'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import cloudinary  from 'cloudinary'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'

// .evn config
dotenv.config()

//database connection call
connectDB()

//cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

//restobject
const app = express()


//middleware
app.use(helmet())
app.use(mongoSanitize())
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(cookieParser())


//route
//routes
// import testRoute from '../server/routes/testRoute.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
app.use('/api/v1/',testRoute)
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/product',productRoutes)
app.use('/api/v1/cat',categoryRoutes)
app.use('/api/v1/order',orderRoutes)

app.get('/',(req,res)=>{
    return res.status(200).send("<h1>boom Human</h1>")
})

//port
const PORT = process.env.PORT || 8080

//listen

app.listen(PORT, ()=>{
    console.log(`Server Running on PORT: ${process.env.PORT} on ${process.env.NODE_ENV} mode`.bgMagenta)
})


export default app;
