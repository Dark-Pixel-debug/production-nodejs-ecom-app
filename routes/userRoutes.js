import express from 'express'
import { getUserProfileController, loginController, logoutController, passwordResetController, registerController, upadtePasswordContoller, updateProfileController, updateProfilePic } from '../controllers/userController.js'
import  { isAuth } from '../middleware/authMiddleware.js'
import { singleUpload } from '../middleware/multer.js'
import { rateLimit } from 'express-rate-limit'
//RAte limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

//router object
const router = express.Router()

//routes
//register
router.post('/register',limiter,registerController)

//login
router.post('/login',limiter,loginController)

//profile
router.get("/profile",isAuth,getUserProfileController)

//logout
router.get('/logout',isAuth,logoutController)

//update profile
router.put('/profile-update',isAuth,updateProfileController)

//update password
router.put('/update-password',isAuth,upadtePasswordContoller)

//update profile pic
router.put('/update-picture',isAuth,singleUpload,updateProfilePic)

//forgot password
router.post('/reset-password',passwordResetController)


export default router