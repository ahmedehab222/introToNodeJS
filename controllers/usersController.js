const User = require('../models/usersModel')
const httpStatusText = require('../utils/httpStatusText')
const appError = require('../utils/appError')
const asyncWrapper = require('../middlewares/asyncWrapper')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const generateJwt = require('../utils/generateJwt')
const getAllUsers = asyncWrapper(async (req,res,next)=>{
    const query  =req.query
    const limit = query.limit || 10
    const page = query.page || 1
    const skip = (page - 1) * limit
    users=await User.find({},{"__v":false,"password":false}).limit(limit).skip(skip)
    res.status(200).json({status: httpStatusText.SUCCESS , data: {users}})
})

const register = asyncWrapper (async(req,res,next) => {
    const {firstname,lastname,email,password,role} = req.body
    const prevUser = await User.findOne({email:email})
    console.log(req.file)
    if(prevUser){
        const error = appError.create("email already in use",400,httpStatusText.FAIL)
        return next(error)
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role,
        avatar:req.file.filename
    })

    const token = await generateJwt({email: newUser.email , id: newUser._id, role: newUser.role})
    newUser.token= token
    await newUser.save()
    res.status(200).json({status: httpStatusText.SUCCESS , data: {newUser}})
})


const login = asyncWrapper (async(req,res,next)=>{
    const {email,password} = req.body
    const user = await User.findOne({email:email})
    if(!user){
        const error = appError.create("user not found",400,httpStatusText.FAIL)
        return next(error)   
    }
    const matchedPassword = await bcrypt.compare(password,user.password)
    if(matchedPassword){
        const token = await generateJwt({email: user.email , id: user._id,role: user.role})
        user.token= token
        return res.json({status:httpStatusText.SUCCESS , data: {token}})
    }else{
        const error = appError.create("password is incorrect",500,httpStatusText.ERROR)
        return next(error)   
    }
})

module.exports={
    getAllUsers,
    register,
    login
}