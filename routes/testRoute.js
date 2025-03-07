import express from 'express'
import { testController } from '../controllers/testController.js'
//router obj
const router = express.Router()

//routes
router.get('/test',testController)



//export 
export default router