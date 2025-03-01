const appError = require("../utils/appError")
const httpStatusText = require("../utils/httpStatusText")

module.exports = (...roles) => {
    return (req,res,next) =>{
        console.log(req.currentUser)
        if(!roles.includes(req.currentUser.role)){
            return next(appError.create("this role is nou authorized",401,httpStatusText.ERROR))
        }
        next()
    }
}