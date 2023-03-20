const User = require('../models/User');
const Course = require('../models/Course');
const Category = require('../models/Category');

const getAdminPage = async (req,res) => {
    const users = await User.find().sort('role');
    const courses = await Course.find().populate('user');
    const categories = await Category.find();
    res.status(200).render('admin', {
        page_name: 'admin',
        users,
        courses,
        categories
    });
}

const deleteUser = async (req,res) => {
    await User.findByIdAndRemove(req.params.id);
    await Course.deleteMany({user: req.params.id});
    res.redirect('/admin');
}
const deleteCourse = async (req,res) => {
    await Course.findByIdAndRemove(req.params.id);
    res.redirect('/admin');
}
const deleteCategory = async (req,res) => {
    await Category.findByIdAndRemove(req.params.id);
    res.redirect('/admin');
}
const createCategory = async (req,res) => {
    await Category.create(req.body);
    res.redirect('/admin');
}

module.exports = {
    getAdminPage,
    deleteUser,
    deleteCourse,
    deleteCategory,
    createCategory
}