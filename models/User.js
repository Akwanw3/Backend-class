const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
    },
    phone: {
        type: String
    },
    password: {
        type: String
    },
    Role: {
        type: String,
        default: 'user'
    },
    referralCode: {
        type: String
    },
    referredBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    verificationCode: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("User", userSchema);