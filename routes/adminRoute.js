const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware('admin'), adminController.getAdminPage);
router.delete('/users/:id', adminController.deleteUser);
router.delete('/courses/:id', adminController.deleteCourse);
router.delete('/categories/:id', adminController.deleteCategory);
router.post('/categories', adminController.createCategory);

module.exports = router;