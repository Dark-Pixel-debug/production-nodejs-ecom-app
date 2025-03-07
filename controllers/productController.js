import productModel from "../models/productModel.js"
import cloudinary from 'cloudinary'
import { getDataUri } from '../utils/features.js'
import userModel from "../models/userModel.js"


//get all products
export const getAllProductsController = async(req,res) => {
    const {keyword,category} = req.query
    try {
        const products = await productModel.find({
            name: {
                $regex : keyword ? keyword:'',
                $options : 'i'
            },
            // category: category ? category : undefined,
        })
        .populate('category')
        res.status(200).send({
            success: true,
            message: 'Products fetched successfully',
            totalLength: products.length,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in get all product api',
            
        })
    }
}
//get top product
export const getTopProductController = async(req,res) => {
    try {
        //find
        const product = await productModel.find({}).sort({rating: -1}).limit(3)
        res.status(200).send({
            success: true,
            message: 'top 3 product',
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in top product api',
            
        })
    }
}

//get single product
export const getSingleProdutController = async(req,res) => {
    try {
        //get id
        const product = await productModel.findById(req.params.id)
        //validation
        if(!product){
            return res.status(404).send({
                status: false,
                message: 'product not found'
            })
        }
        res.status(200).send({
            success: true,
            message: 'Product found',
            product
        })
    } catch (error) {
        console.log(error)
        //cast error
        if(error.name === 'CastError'){
            return res.status(500).send({
                success: false,
                message: 'Invalid id'
            })
        }
        res.status(500).send({
            success: false,
            message: 'Error in get single product api'
        })
    }
}

//create product
export const createProductController = async(req,res) => {
    try {
        const {name,description,price,stock,category} = req.body
        // stock = Number(stock)
        //validation
        // if(!name || !description || !price || !stock){
        //     return res.status(500).send({
        //         success: false,
        //         message: 'Provide all fields'
        //     })
        // }
        if(!req.file){
            return res.status(500).send({
                success:false,
                message: 'please provide product image'
            })
        }
        const file = getDataUri(req.file)
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cdb.public_id,
            url : cdb.secure_url
        }
        
        await productModel.create({
            name,description,price,stock,category,images:[image]
        })
        res.status(200).send({
            success:true,
            message:'Product created successfully'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            success: false,
            message: 'Error in get create product api'
        })
    }
}

//update product
export const updateProductController = async(req,res) => {
    try {
        //find product
        const product = await productModel.findById(req.params.id)
        //validationg
        if(!product){
            return res.status(404).send({
                success: false,
                message: 'product not found'
            })
        }
        const {name,description,price,stock,category} = req.body
        //validate and update
        if(name) product.name = name
        if(description) product.description = description
        if(price) product.price = price
        if(stock) product.stock = stock
        if(category) product.category = category
        await product.save()
        res.status(200).send({
            success: 'true',
            message: 'product details updated successfully'
        }

        )
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
            message: 'Error in get update product api'
        })
    }
}

//update product image
export const updateProductImageController = async(req,res) => {
    try {
        //find product
        const product = await productModel.findById(req.params.id)
        //validation
        if(!product){
            return res.status(404).send({
                success: false,
                message: 'product not found'
            })
        }
        if(!req.file){
            return res.status(404).send({
                success: false,
                message: 'product image not found'
            })
        }
        const file = getDataUri(req.file)
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        //save
        product.images.push(image)
        await product.save()
        res.status(200).send({
            success:true,
            message: 'product image updated'
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
            message: 'Error in get update product api'
        })
    }
}

//delete product image 
export const deleteProductImageController = async(req,res) => {
    try {
        //find
        const product = await productModel.findById(req.params.id)
        //validation
        if(!product){
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            })
        }
         //image id
         const id = req.query.id
         if(!id){
             return res.status(404).send({
                success: false,
                message: "product image not found"
             })
         }
         let isExist = -1
         product.images.forEach((item,index) => {
            if(item._id.toString() === id.toString()) isExist = index
         })
         if(isExist < 0){
            return res.status(404).send({
                success: false,
                message: 'Image not found'
            })
         }
         //delete image
         await cloudinary.v2.uploader.destroy(product.images[isExist].public_id)
         product.images.splice(isExist, 1)
         await product.save()
         res.status(200).send({
            success: true,
            message: 'product image deleted successfully!'
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
//delete product
export const deleteProductController = async(req,res) => {
    try {
        //find
        const product = await productModel.findById(req.params.id)
        //validation
        if(!product){
            return res.status(404).send({
                success:false,
                message: 'product not found'
            })
        }
        //find and del image form clodinary
        for(let index = 0 ; index < product.images.length; index ++){
            await cloudinary.v2.uploader.destroy(product.images[index].public_id)
        }
        await product.deleteOne()
        res.status(200).send({
            success: true,
            message: 'Product deleted successfully'
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

//review function
export const productReviewController = async(req,res) => {
    try {
        const {comment,rating} = req.body
        // get productss
        const product = await productModel.findById(req.params.id)
        // check previous review
        const alreadyReview = product.reviews.find((r) => r.user.toString() === req.user._id.toString())
        if (alreadyReview){
            return res.status(400).send({
                success: false,
                message: 'PRoduct already reviewed'
            })
        }
        //review object
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        //passing review object 2
        product.reviews.push(review)
        //number of reviews
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc,item) => item.rating + acc, 0) / product.reviews.length
        //save 
        await product.save()
        res.status(200).send({
            success: true,
            message: 'review added'
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
            message: 'Error in get review product image api'
        })
    }
}