const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');

const createCourse = async (req,res) => {
    try {
        const course = await Course.create({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            user: req.session.userID
        });
        req.flash('success', 'Course Has Been Created Successfully');
        res.status(201).redirect('/users/dashboard');
    } catch (error) {
        req.flash('error', 'Something Happened');
        res.status(400).redirect('/courses');
    }
};
const getAllCourses = async (req,res) => {
    const categorySlug = req.query.category;
    const searchQuery = req.query.search;
    let filter = {};
    try {
        if(categorySlug) {
            const category = await Category.findOne({'slug': categorySlug});
            filter = {category: category._id};
        }
        if (searchQuery) {
            filter = {name: searchQuery}
        }
        if (!categorySlug && !searchQuery) {
            filter.name = "";
            filter.category = null;
        }
        const courses = await Course.find({
            $or:[
                {name: { $regex: '.*' + filter.name + '.*', $options: 'i'}},
                {category: filter.category}
            ]
        }).populate('user').sort('-createdAt');
        const categories = await Category.find();
        res.status(200).render('courses', {
            page_name: 'courses',
            categories,
            courses
        });
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            error
        });
    }
}
const getCourse = async (req,res) => {
    try {
        const user = await User.findById(req.session.userID);
        const course = await Course.findOne({slug: req.params.slug}).populate('user');
        const categories = await Category.find();
        res.status(200).render('course-single', {
            page_name: 'course',
            user,
            course,
            categories
        });
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            error
        });
    }
}
const enrollCourse = async (req,res) => {
    try {
        const user = await User.findById(req.session.userID);
        const course = await Course.findById(req.body.course_id);
        if(!user.courses.includes(course._id)) {
            user.courses.push(course._id);
        }
        await user.save();
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            error
        });
    }
}
const releaseCourse = async (req,res) => {
    try {
        const user = await User.findById(req.session.userID);
        const course = await Course.findById(req.body.course_id);
        user.courses.pull(course._id);
        await user.save();
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            error
        });
    }
}
const deleteCourse = async (req,res) => {
    try {
        const course = await Course.findOneAndRemove({slug: req.params.slug});
        req.flash('error', `${course.name} has been deleted`);
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            error
        });
    }
}
const updateCourse = async (req,res) => {
    try {
        const course = await Course.findOne({slug: req.params.slug});
        course.name = req.body.name;
        course.description = req.body.description;
        course.category = req.body.category;
        await course.save();
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            error
        });
    }
}

module.exports = {
    createCourse,
    getAllCourses,
    getCourse,
    enrollCourse,
    releaseCourse,
    deleteCourse,
    updateCourse
}