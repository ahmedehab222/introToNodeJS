const {body} =require('express-validator')

module.exports =
 () => 
     [
        body('title')
        .notEmpty().withMessage('title is required')
        .isLength({min:2}).withMessage('title must be at least 2 characters'),
        body('price')
        .notEmpty().withMessage('price is required')
    ]