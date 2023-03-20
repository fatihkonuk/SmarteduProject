const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["student","teacher","admin"]
    },
    password: {
       type: String, 
       required: true
    },
    courses: [{
        type: mongoose.Types.ObjectId,
        ref: 'Course'
    }]
});

UserSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            console.log(err);
        }else {
            user.password = hash;
        }
        next();
    })
});

const User = mongoose.model('User', UserSchema);

module.exports = User;