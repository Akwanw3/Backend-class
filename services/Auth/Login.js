const User = require("../../models/User"); // FIX: Added missing import
const ErrorResponse = require("../../utils/ErrorResponse");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email and include password field (usually excluded)
        const user = await User.findOne({ email }).select("+password");
        
        // Check if user exists
        if (!user) {
            throw new ErrorResponse("Invalid email or password", 401);
        }
        
        // Check if user is verified
        if (!user.isVerified) {
            throw new ErrorResponse("Please verify your email before logging in", 401);
        }
        
        // Compare provided password with hashed password in database
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (!isPasswordMatch) {
            throw new ErrorResponse("Invalid email or password", 401);
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email,
                role: user.Role 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || "7d" }
        );
        
        // Remove password from user object before sending response
        user.password = undefined;
        
        return {
            data: user,
            metaData: {
                token: token,
                expiresIn: process.env.JWT_EXPIRE || "7d",
                tokenType: "Bearer"
            }
        };
        
    } catch (error) {
        console.log(error);
        
        // If it's already an ErrorResponse, throw it as is
        if (error instanceof ErrorResponse) {
            throw error;
        }
        
        throw new ErrorResponse(`Login Error: ${error.message}`, 500);
    }
}

module.exports = login;
