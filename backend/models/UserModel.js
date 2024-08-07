const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const validator = require('validator');
const RateLimit = require('express-rate-limit');

const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    mobile_no: {
        type: Number,
        required: true
    },
    user_password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    role: {
        type: String,
        default: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date,
        default: null
    },

},

    {
        toJSON: {
            transform(doc, ret) {
                delete ret.user_password;
            },
        },
    }
);


// Hash password before saving to database
UserSchema.pre('save', async function (next) {
    const User = this;
    if (User.isModified('password') || User.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(User.user_password, salt);
            User.user_password = hash;
            next();
        } catch (err) {
            return next(err);
        }
    } else {
        return next();
    }
});


// Compare password with hashed password in database
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.user_password);
};


module.exports = User = mongoose.model("User", UserSchema);