const express = require('express')

const courseController = require('../controllers/courseController')
const createValidation = require('../middlewares/createValidation')
const verifyToken = require('../middlewares/verifyToken')
const allowedTo = require('../middlewares/allowedTo')
const userRoles = require('../utils/userRoles')
const router =express.Router()

router.route('/')
        .get(courseController.getCourses)
        .post(verifyToken,allowedTo(userRoles.MANAGER),createValidation(),courseController.createCourse)


router.route('/:courseId')
        .get(courseController.getCourseById)
        .patch(courseController.updateCourse)
        .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),courseController.deleteCourse)
module.exports = router
