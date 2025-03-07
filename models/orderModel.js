import mongoose from 'mongoose'
const orderSchema = new mongoose.Schema({
   shippingInfo :{
    address:{
        type:String,
        required:[true,'address is required']
    },
    city: {
        type: String,
        required:[true,'city name is required']
    },
    country: {
        type: String,
        required: [true,'country name is required']
    }
   },
   orderItems: [
    {
        name: {
            type: String,
            required: [true,'product name is required']
        },
        price: {
            type: Number,
            required: [true,'product price is required']
        },
        quantity: {
            type: Number,
            required: [true,'product quantity is required']
        },
        image: {
            type: String,
            required: [true,'product image is required']
        },
        product: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true
           }
           
    }
   ],
   paymentMethod: {
    type: String,
    enum: ["COD","Online"],
    default: "COD"
   },
   user: {
    type :mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required:[true,'userID is required']
   },
   paidaAt: Date,
   paymentInfo:{
    id: String,
    status: String
   },
   itemPrice: {
    type: Number,
    required: [true,'item price required']
   },
   tax: {
    type: Number,
    required: [true,'tax price required']
   },
   shippingCharges: {
    type: Number,
    required: [true,'shippingChages price required']
   },
   totalAmount: {
    type: Number,
    required: [true,'item Total Amount required']
   },
   orderStatus: {
    type: String,
    enum: ['Processing','Shipped','Delivered'],
    default: 'Processing'
   },
   deliverAt: Date
   
},{timestamps:true})



export const orderModel = mongoose.model('Orders', orderSchema)
export default orderModel