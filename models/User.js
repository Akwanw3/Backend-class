const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        type: String,
        select: false  // Don't include password in queries by default
    },
    Role: {
        type: String,
        default: 'user'
    },
    referralCode: {
        type: String
    },
    referredBy: {
        type: String  // Changed from ObjectId to String to match referral code format
    },
    verificationCode: {
        type: String,
        select: false  // Don't include verification code in queries by default
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// FIX: Add password hashing middleware
// This runs automatically before saving a user document
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
});

// Optional: Add method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);