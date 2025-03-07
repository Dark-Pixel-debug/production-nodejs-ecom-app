import express from 'express'
import  { isAdmin, isAuth } from '../middleware/authMiddleware.js'
import { createCategory, deleteCategoryController, getAllCategoriesController, updateCategoryController } from '../controllers/categoryController.js'


const router = express.Router()

//create category
router.post('/create',isAdmin,isAuth,createCategory)
//get-all category
router.get('/get-all',getAllCategoriesController)
//del category
router.delete('/delete/:id',isAdmin,isAuth,deleteCategoryController)
//updaate category
router.put('/update/:id',isAdmin,isAuth,updateCategoryController)



export default router