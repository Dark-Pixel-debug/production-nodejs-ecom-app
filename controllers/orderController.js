import orderModel from "../models/orderModel.js"
import productModel from "../models/productModel.js"

//create order 
export const  createOrderController = async(req,res) => {
    try {
        const {shippingInfo,orderItems,paymentMethod,paymentInfo,itemPrice,tax,shippingCharges,totalAmount} = req.body
        //validation
        if(!shippingInfo || !orderItems || !itemPrice || !tax || !shippingCharges || !totalAmount){
            return res.status(400).send({
                success: false,
                message: 'all order details required'
            })
        
        }
        //create
        await orderModel.create({
            user: req.user._id,
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount
        })
        //stock update
        for (let i = 0; i<orderItems.length; i++){
            //find product
            const product = await productModel.findById(orderItems[i].product)
            product.stock -= orderItems[i].quantity
            await product.save()
        }
        res.status(201).send({
            success: true,
            message: 'order placed successfully'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            success:false,
            message: 'Error in create order api',
            error
        })
    }
}

//get all orders - my orders
export const getMyOrdersController = async(req,res) => {
    try {
        // find orders
        const orders = await orderModel.find({user : req.user._id})
        //validation
        if(!orders){
            return res.status(404).send({
                success: false,
                message: 'order not found'
            })
        }
        res.status(200).send({
            success: true,
            message: 'your order data',
            totalOrder: orders.length,
            orders
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            success:false,
            message: 'Error in My orders api',
            error
        })
    }
}

//get single order details
export const singleOrderDetail = async(req,res) => {
    try {
        //find orders
        const order = await orderModel.findById(req.params.id)
        //validation
        if(!order){
            return res.status(404).send({
                success: false,
                message: 'no order found'
            })
        }
        res.status(200).send({
            success: true,
            message: 'your order fetched',
            order
        })
    } catch (error) {
        console.log(error.message)
        if(error.name === 'CastError'){
            return res.status(500).send({
                success: false,
                message: 'Invalid id'
            })
        }
        res.status(500).send({
            success: false,
            message: 'Error in get delete product image api'
        })
    }
}

//=======admin==========
//get all order
export const getAllOrdersController = async(req,res) => {
    try {
        const orders = await orderModel.find({})
        res.status(200).send({
            success: true,
            message: 'all orders data',
            totalOrders : orders.length,
            orders
        })
    } catch (error) {
        console.log(error.message)
        if(error.name === 'CastError'){
            return res.status(500).send({
                success: false,
                message: 'Invalid id'
            })
        }
        res.status(500).send({
            success: false,
            message: 'Error in get admion order image api'
        })
    }
}

//change order status
export const changeOrderStatusController = async(req,res) => {
    try {
        //find order
        const order = await orderModel.findById(req.params.id)
        //validation
        if(!order){
            return res.status(404).send({
                success: false,
                message: 'order not found'
            })
        }
        if(order.orderStatus==='Processing') order.orderStatus = 'Shipped'
        else if(order.orderStatus==='Shipped') {order.orderStatus = 'Delivered'
            order.deliverAt = Date.now()
        }else{
            return res.status(500).send({
                success:false,
                message:  'Order already delivered'
            })
        }
        await order.save()
        res.status(200).send({
            success: true,
            message: 'order status updated'
        })
    } catch (error) {
        console.log(error.message)
        if(error.name === 'CastError'){
            return res.status(500).send({
                success: false,
                message: 'Invalid id'
            })
        }
        res.status(500).send({
            success: false,
            message: 'Error in get change order image api'
        })
    }
}