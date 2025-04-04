import mongoose from 'mongoose'
import colors from 'colors'

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connected to: ${mongoose.connection.host}`.bgGreen.white)
    } catch (error){
        console.log(`MonggoDb Error ${error}`.bgRed.white)
    }
}
export default connectDB