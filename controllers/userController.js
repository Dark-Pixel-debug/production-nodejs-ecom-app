import { token } from 'morgan'
import userModel from '../models/userModel.js'
import { getDataUri } from '../utils/features.js'
import cloudinary from 'cloudinary'

export const registerController = async(req,res) => {
    try {
        const {name,email,password,address,city,country,phone,answer} = req.body
        //validation
        console.log("Received Data:", req.body);
        if(!name || !email || !password || !address || !city || !country || !phone || !answer){
            return res.status(500).send({
                success: false,
                message: 'Please provide all fields'
            })
        }
        //check existing user
        const existinguser = await userModel.findOne({email})
        //validation
        if(existinguser){
            return res.status(500).send({
                success: false,
                message: 'Email already exist'
            })
        }
        const user = await userModel.create({name,email,password,address,city,country,phone,answer})
        res.status(201).send({
            success: true,
            message: 'Restration success please login',
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in register API'
        })
    }
}

//login

export const loginController = async (req,res) => {
    try {

        const{email,password} = req.body
        //validation
        if(!email || !password){
            return res.status(500).send({
                success: false,
                message: 'Please add email or password'
            })
        }

        //check user
        const user = await userModel.findOne({email})
        //user validation
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }
        //check password
        const isMatch = await user.comparePass(password)
        //validation
        if(!isMatch){
            return res.status(500).send({
                success:false,
                message: 'invalid credentials'
            })
        }
        //token
        const token = user.generateToken()
        res.status(200).cookie("token",token,{
            secure: process.env.NODE_ENV === "development" ? true: false,
            httpOnly: process.env.NODE_ENV === "development" ? true: false,
            sameSite: process.env.NODE_ENV === "development" ? true: false,
            expires : new Date(Date.now() + 15 * 24 * 60 * 50 * 1000)

        }) .send({
            success: true,
            message: 'Login Successfull',
            token,
            user
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message:'Error in login api'
        })
    }
}


//get user profile
export const getUserProfileController = async (req,res) => {
    try {
        const user = await userModel.findById(req.user._id)
        user.password = undefined
        res.status(200).send({
            success: true,
            message: 'user profiled fetched successfully',
            user
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in profile api',
            error
        })
        
    }
}

//logout

export const logoutController = async (req,res) => {
    try {
        res.status(200).cookie("token","",{
            secure: process.env.NODE_ENV === "development" ? true: false,
            httpOnly: process.env.NODE_ENV === "development" ? true: false,
            sameSite: process.env.NODE_ENV === "development" ? true: false,
            expires : new Date(Date.now())

        }).send({
            success: true,
            message: 'logout succesfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in logout api',
            error
    })
}
};


//Update User Profile

export const updateProfileController = async (req,res) => {
    try {
        const user = await userModel.findById(req.user._id)
        const {name,email,address,city,country,phone} = req.body
        //validation+update
        if (name) user.name = name
        if (email) user.email = email
        if (address) user.address = address
        if (city) user.city = city
        if (country) user.country = country
        if (phone) user.phone = phone
        //save user
        await user.save()
        res.status(200).send({
            success: true,
            message: 'User Updated'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in update api',
            error
    })
}
}

//update user password
export const upadtePasswordContoller = async(req,res) => {
    try {
        const user = await userModel.findById(req.user._id)
        const {oldPassword, newPassword} = req.body
        //validation
        if(!oldPassword || !newPassword){
            return res.status(500).send({
                success: false,
                message: 'Please provide old or new password'
            })
        }
        //old pass check
        const isMatch = await user.comparePass(oldPassword)
        //validation
        if(!isMatch){
            return res.status(500).send({
                success: false,
                message: 'Invalid old password'
            })
        }
        user.password = newPassword
        await user.save()
        res.status(200).send({
            success: true,
            message: 'password Updated successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in password api',
            error
    })
    }
}

// update user profile photo
export const updateProfilePic = async(req,res) => {
    try {
        const user = await userModel.findById(req.user._id)
        // get file from client
        const file = getDataUri(req.file)
        //del prev image
        await cloudinary.v2.uploader.destroy(user.profilepic.public_id)
        // update
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        user.profilepic = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        //saving func
        await user.save()
        res.status(200).send({
            success: true,
            message: 'Profile Updated successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in update picture api',
            error
    })
    }
}

//forgot password
export const passwordResetController = async(req,res) => {
    try {
        // user get email || newPassword || answer
        const {email,newPassword,answer} = req.body
        if(!email || !newPassword || !answer){
            return res.status(500).send({
                success: false,
                message: 'Please provide all fields'
            })
        }
        //find email and answer
        const user = await userModel.findOne({email,answer})
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'Invalid User of answer'
            })
        }
        
        user.password = newPassword
        await user.save()
        res.status(200).send({
            success: true,
            message: 'Your password has been reset please login'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in password reset api',
            error
    })
    }
}
