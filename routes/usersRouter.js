const express = require('express')
const usersController = require('../controllers/usersController')
const verifyToken = require('../middlewares/verifyToken')
const multer  = require('multer')
const appError = require('../utils/appError')

const diskStorage = multer.diskStorage({
    destination:function (req,file,cb){
        console.log("FILE",file)
        cb(null,'uploads')
    },
    filename: function (req,file,cb){
        const ext = file.mimetype.split('/')[1]
        const filename= `user-${Date.now()}.${ext}`
        cb(null,filename)
    }
})

const fileFilter = (req,file,cb)=>{
    const imageType = file.mimetype.split('/')[0]
    if(imageType==='image'){
        cb(null,true)
    }else{
        cb(appError.create('invalid file type',400),false)
    }
}


const upload = multer({storage: diskStorage, fileFilter})


router = express.Router()

router.route('/')
            .get(verifyToken,usersController.getAllUsers)
router.route('/register')
            .post(upload.single('avatar'),usersController.register)
router.route('/login')
            .post(usersController.login)

module.exports = router