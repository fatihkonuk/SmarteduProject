const nodemailer = require('nodemailer');
const User = require('../models/User');
const Course = require('../models/Course');

const getIndexPage = async (req,res) => {
    const totalStudent = await User.find({role: 'student'}).count();
    const totalTeacher = await User.find({role: 'teacher'}).countDocuments();
    const totalCourse = await Course.find().countDocuments();
    res.status(200).render('index', {
        page_name: 'index',
        totalStudent,
        totalTeacher,
        totalCourse
    });
};
const getAboutPage = (req,res) => {
    res.status(200).render('about', {
        page_name: 'about'
    });
};

const getContactPage = (req,res) => {
    res.status(200).render('contact', {
        page_name: 'contact'
    });
};
const postContactPage = async (req,res) => {
    try {
        const outputMessage = `
        <h1>Mail Details</h1>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
        `;
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "no1.fatih@gmail.com",
                pass: "hxxqebkjxxitrgqo1",
            },
        });
        let info = await transporter.sendMail({
            from: '"SmartEdu" <smartedu@info.com>', // sender address
            to: "no1.fatih@gmail.com", // list of receivers
            subject: "SmartEdu", // Subject line
            html: `${outputMessage}`, // html body
        });
        req.flash('success', 'We Recieved Your Message Successfully');
        res.status(200).redirect('contact');
    } catch (error) {
        req.flash('error', 'Something Happened');
        res.status(400).redirect('contact');
    }
    

}
const getLoginPage = (req,res) => {
    res.status(200).render('login', {
        page_name: 'login'
    });
}
const getRegisterPage = (req,res) => {
    res.status(200).render('register', {
        page_name: 'register'
    });
}

module.exports = {
    getIndexPage,
    getAboutPage,
    getContactPage,
    postContactPage,
    getLoginPage,
    getRegisterPage
}
