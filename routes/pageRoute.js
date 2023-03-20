const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const redirectMiddleware = require('../middlewares/redirectMiddleware');

router.get('/', pageController.getIndexPage);
router.get('/about', pageController.getAboutPage);
router.get('/contact', pageController.getContactPage);
router.post('/contact', pageController.postContactPage);
router.get('/login', redirectMiddleware, pageController.getLoginPage);
router.get('/register', redirectMiddleware, pageController.getRegisterPage);

module.exports = router;