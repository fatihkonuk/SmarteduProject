const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');

const createUser = async (req,res) => {
    try {
        await User.create(req.body);
        req.flash('success', 'Your Account Has Been Created Successfully')
        res.status(201).redirect('/login');
    } catch (error) {
        const errors = validationResult(req);
        const errMsg = errors.array()[0].msg
        req.flash('error', errMsg);
        req.flash('name', req.body.name);
        req.flash('email', req.body.email);
        res.status(400).redirect('/register');
    }
}
const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                req.session.userID = user._id; 
                if (user.role === 'admin') {
                    res.status(200).redirect('/admin');
                }else {
                    res.status(200).redirect('/users/dashboard');
                }
            }
            else {
                req.flash('error', 'Password is not correct!');
                res.redirect('/login');
            }
        }else {
            req.flash('error', 'User is not exist!');
            res.redirect('/login');
        }
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            error: error.message
        });
    }
}
const logoutUser = async (req,res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

const getDashboardPage = async (req,res) => {
    const user = await User.findOne({_id: req.session.userID}).populate('courses');
    const categories = await Category.find();
    const courses = await Course.find({user: req.session.userID});
    res.render('dashboard', {
        page_name: 'dashboard',
        user,
        categories,
        courses
    });
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getDashboardPage
}