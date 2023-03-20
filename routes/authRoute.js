const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', 
    [
        body('name').not().isEmpty().withMessage('Please Enter Your Name'),
        body('email').isEmail().withMessage('Please Enter Valid Email')
        .custom(async userEmail => {
            return await User.findOne({email: userEmail}).then(user => {
                if (user) {
                    return Promise.reject('Email is already exists!');
                }
            })
        }),
        body('password').not().isEmpty().withMessage('Please Enter A Password'),
    ], 
    authController.createUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);
router.get('/dashboard', authMiddleware, authController.getDashboardPage);

module.exports = router;