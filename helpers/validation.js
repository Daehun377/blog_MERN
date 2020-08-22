const {check} = require("express-validator");

exports.validationSignup = [

    check(`name`, `name is required`)
        .notEmpty()
        .isLength({min : 4, max : 32})
        .withMessage(`name must be between 4 and 32 characters`),
    check(`email`)
        .isEmail()
        .withMessage(`must be a valid email address`),
    check(`password`, `password is required`)
        .notEmpty()
        .isLength({min : 6})
        .withMessage(`password must contain at least 6 characters`)
        .matches(/\d/)
        .withMessage(`password must contian a number`)

];

exports.validationLogin = [
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password', 'password is required').notEmpty(),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('password must contain a number')
];