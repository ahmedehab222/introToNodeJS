const {validationResult} =require('express-validator')
const Course = require('../models/courseModel')
const httpStatusText = require('../utils/httpStatusText')
const asynncWrapper = require('../middlewares/asyncWrapper')
const appError  =require('../utils/appError')


const getCourses = asynncWrapper(async (req,res,next)=>{
    const query  =req.query
    const limit = query.limit || 10
    const page = query.page || 1
    const skip = (page - 1) * limit
    courses=await Course.find({},{"__v":false}).limit(limit).skip(skip)
    res.status(200).json({status: httpStatusText.SUCCESS , data: {courses}})
})

const getCourseById = asynncWrapper(async (req,res,next)=>{

    const course = await Course.findById(req.params.courseId)
    if(!course){
        const error = appError.create("course not found",404,httpStatusText.FAIL)
        next(error)
    }else{
        res.status(200).json({status: httpStatusText.SUCCESS , data: {course}})
    }
})

const createCourse = asynncWrapper(async (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = appError.create(errors.array(),400,httpStatusText.ERROR)
        next(error)
    }
    const newCourse = new Course(req.body)
    newCourse.save()
    res.status(201).json({status: httpStatusText.SUCCESS , data: {newCourse}})
})

const updateCourse  =asynncWrapper(async (req,res,next)=>{
    const courseId =req.params.courseId
    const updatedCourse = await Course.updateOne({"_id":courseId},{...req.body})
    res.status(200).json({status: httpStatusText.SUCCESS , data: {updatedCourse}})
})

const deleteCourse =asynncWrapper(async (req,res,next)=>{
    const courseId =req.params.courseId
    const info = await Course.deleteOne({"_id":courseId})
    res.status(200).json({status: httpStatusText.SUCCESS , data: {info}})
})

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
}