import express from 'express'
import  { isAdmin, isAuth } from '../middleware/authMiddleware.js'
import { changeOrderStatusController, createOrderController, getAllOrdersController, getMyOrdersController, singleOrderDetail } from '../controllers/orderController.js'

const router = express.Router()

//create
router.post('/create',isAuth,createOrderController)

//get all orders
router.get('/my-orders',isAuth,getMyOrdersController)
//get single orders
router.get('/my-orders/:id',isAuth,singleOrderDetail)

//admin
//get all orders
router.get('/admin/getall-orders',isAuth,isAdmin,getAllOrdersController)

//change order status
router.put('/admin/order/:id',isAuth,isAdmin,changeOrderStatusController)


export default router