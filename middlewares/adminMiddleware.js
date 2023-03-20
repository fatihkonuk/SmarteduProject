const User = require('../models/User');

module.exports = (role) => {
    return async (req,res,next) => {
        const user = await User.findById(req.session.userID);
        if (role == user.role) {
            next();
        }else {
            res.status(401).send('You Cant Do It');
        }
    }
}