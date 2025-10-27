const User = require("../../models/User");
const ErrorResponse = require("../../utils/ErrorResponse");
const crypto = require("crypto");

/**
 * VERIFY EMAIL SERVICE
 * This service handles email verification using OTP
 * 
 * Process:
 * 1. Get email and OTP from request body
 * 2. Hash the OTP the same way we did during registration
 * 3. Find user by email and the hashed OTP
 * 4. If found, mark user as verified
 * 5. Clear the verification code from database
 */

const verifyEmail = async (req, res, next) => {
    try {
        // Extract email and otp from request body
        // These come from the user's input after they receive the OTP via email
        const { email, otp } = req.body;

        // Hash the OTP using SHA256 algorithm
        // WHY? During registration, we stored the hashed version of OTP in the database
        // We need to hash the user's input OTP to compare with what's stored
        // crypto.createHash('sha256') - creates a SHA256 hash object
        // .update(otp) - feeds the OTP string into the hash
        // .digest('hex') - converts the hash to hexadecimal string format
        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

        // Find user in database with matching email AND matching verification code
        // This ensures the OTP belongs to this specific user
        // We use .select("+verificationCode") because verificationCode might be excluded by default
        const user = await User.findOne({
            email: email,
            verificationCode: hashedOTP
        }).select("+verificationCode");

        // If no user found, it means either:
        // - Email doesn't exist
        // - OTP is incorrect
        // - OTP has already been used
        if (!user) {
            throw new ErrorResponse("Invalid OTP or email", 400);
        }

        

        // Update user verification status
        // Set isVerified to true - marks the account as verified
        user.isVerified = true;
        
        // Check if user is already verified
        // This prevents re-verification and ensures users don't reuse old OTPs
        if (user.isVerified) {
            throw new ErrorResponse("Email already verified", 400);
        }
        // Clear the verification code from database
        // WHY? Security best practice - OTPs should be single-use
        // Setting to null prevents the same OTP from being used again
        user.verificationCode = null;
        
        // Save the changes to database
        // This commits the isVerified and verificationCode changes
        await user.save();

        // Return success response with user data
        return {
            data: {
                _id: user._id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                isVerified: user.isVerified
            },
            metaData: {
                message: "Email verified successfully"
            }
        };

    } catch (error) {
        // Log the error for debugging purposes
        console.log(error);
        
        // If it's already an ErrorResponse, throw it as is
        if (error instanceof ErrorResponse) {
            throw error;
        }
        
        // Otherwise, wrap it in ErrorResponse with 500 status
        throw new ErrorResponse(`Verify Email Error: ${error.message}`, 500);
    }
};

module.exports = verifyEmail;