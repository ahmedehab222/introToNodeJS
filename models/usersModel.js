const mongoose = require('mongoose')
const validator = require('validator')
const userRoles = require('../utils/userRoles')

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required: true
    },
    lastname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail , 'Email must be valid']
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String
    },
    role:{
        type:String,
        enum:[userRoles.ADMIN,userRoles.MANAGER,userRoles.USER],
        default:userRoles.USER
    },
    avatar:{
        type:String,
        default:"adidasLogo.png"
    }
})

module.exports = mongoose.model('User',userSchema)