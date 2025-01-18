const express = require('express')
const courseRouter  = require('./routes/courseRouter')
const usersRouter  = require('./routes/usersRouter')
const mongoose = require('mongoose');
const cors = require('cors');
const { eventNames } = require('./models/courseModel');
const httpStatusText = require('./utils/httpStatusText')
const path = require('path')

require('dotenv').config()




mongoose.connect(process.env.DBURL).then(()=>{
    console.log("mongodb server connected")
})



const app = express()
app.use(express.json())
app.use(cors())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

app.use('/api/courses',courseRouter)
app.use('/api/users',usersRouter)

app.all('*',(req,res)=>{
    res.status(404).json({status: httpStatusText.ERROR,message:"this resource is not found"})
})

app.use((error,req,res,next)=>{
    res.status(error.statusCode).json({status: error.statusText || httpStatusText.ERROR , message:error.message, code: error.statusCode || 500,data:null })
})

app.listen(process.env.PORT, ()=>{
    console.log('app listening on port ',process.env.PORT)
})
