import express from 'express'
import { createProductController, deleteProductController, deleteProductImageController, getAllProductsController, getSingleProdutController, getTopProductController, productReviewController, updateProductController, updateProductImageController } from '../controllers/productController.js'
import  { isAdmin, isAuth } from '../middleware/authMiddleware.js'
import { singleUpload } from '../middleware/multer.js'

const router = express.Router()

//routes
//get all products
router.get('/get-all', getAllProductsController)
//get top products
router.get('/top', getTopProductController)
//get single products
router.get('/:id', getSingleProdutController)
//create product
router.post('/create',isAuth,isAdmin,singleUpload,createProductController)
//update product
router.put('/:id',isAuth,updateProductController)
//update product image
router.put('/image/:id',isAuth,isAdmin,singleUpload,updateProductImageController)
//delete product image
router.delete('/delete-image/:id',isAuth,isAdmin,deleteProductImageController)
//delete product 
router.delete('/delete/:id',isAuth,isAdmin,deleteProductController)




///reviewsssssssssss
router.put('/:id/review',isAuth,productReviewController)

export default router