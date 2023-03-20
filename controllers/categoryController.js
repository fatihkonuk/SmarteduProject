const Category = require('../models/Category');

const createCategory = async (req,res) => {
    try {
        const category = await Category.create(req.body);
        res.status(200).json({
            status: 'Success',
            category
        });
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            error
        });
    }
}

module.exports = {
    createCategory,
}