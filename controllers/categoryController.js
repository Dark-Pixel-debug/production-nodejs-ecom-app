import categoryModel from "../models/categoryModel.js"
import productModel from "../models/productModel.js"

//create cat
export const createCategory = async(req,res) => {
    try {
        const {category} =  req.body
        //validation
        if(!category){
            return res.status(404).send({
                success: false,
                message: "please provide category"
            })
        }
        await categoryModel.create({category})
        res.status(201).send({
            success: true,
            message: `${category} category created successfully`
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            success: false,
            message: 'error in creating cat api'
        })
    }
}

//getall cat
export const getAllCategoriesController = async(req,res) => {
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            succes:true,
            message: 'categories fetched successfully',
            totalCat: category.length,
            category
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            success: false,
            message: 'error in get all cat cat api'
        })
    }
}

//delete category
export const deleteCategoryController = async(req,res) => {
    try {
        //find category
        const category = await categoryModel.findById(req.params.id)
        //valida
        if(!category){
            return res.status(404).send({
                succes: false,
                message: 'category not found'
            })
        }
        //find product with this category id
        const products = await productModel.find({category:category._id})
        // update category
        for(let i = 0; i< products.length; i++){
            const product = products[i]
            product.category = undefined
            await product.save()
        }

        //save categof
        await category.deleteOne()
        res.status(200).send({
            succes: true,
            message: 'category deleted successfully'
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
            message: 'error in delete cat  api'
        })
    }
}

//update cat 
export const updateCategoryController = async(req,res) => {
    try {
        //find category
        const category = await categoryModel.findById(req.params.id)
        //valida
        if(!category){
            return res.status(404).send({
                succes: false,
                message: 'category not found'
            })
        }
        //get new cat
        const {updatedCat} =  req.body
        //find product with this category id
        const products = await productModel.find({category:category._id})
        // update category
        for(let i = 0; i< products.length; i++){
            const product = products[i]
            product.category = updatedCat
            await product.save()
        }

        if(updatedCat) category.category = updatedCat

        //save categof
        await category.save()
        res.status(200).send({
            succes: true,
            message: 'category updated successfully'
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
            message: 'error in update cat  api'
        })
    }
}