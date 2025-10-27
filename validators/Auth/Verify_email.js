const Joi = require("joi");
const ErrorResponse = require("../../utils/ErrorResponse");

/**
 * VERIFY EMAIL VALIDATION SCHEMA
 * 
 * WHAT IS JOI?
 * - A powerful schema description and data validation library
 * - Helps validate user input before processing
 * - Prevents invalid data from reaching our database
 * 
 * WHY VALIDATE?
 * - Security: Prevent malicious input
 * - Data Integrity: Ensure data format is correct
 * - Better Error Messages: Tell users exactly what's wrong
 */

// Define the validation schema for email verification
const verifyEmailSchema = Joi.object({
    // Email field validation
    email: Joi.string()
        .email() // Must be valid email format (checks for @, domain, etc.)
        .required() // Field is mandatory
        .messages({ // Custom error messages
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty'
        }),
    
    // OTP field validation
    otp: Joi.string()
        .length(6) // Must be exactly 6 characters
        .pattern(/^[0-9]+$/) // Must contain only numbers (0-9)
        .required()
        .messages({
            'string.length': 'OTP must be exactly 6 digits',
            'string.pattern.base': 'OTP must contain only numbers',
            'any.required': 'OTP is required',
            'string.empty': 'OTP cannot be empty'
        })
});


const validateVerifyEmailObj = async (req, res, next) => {
    try {
        
        if (!req.body || Object.keys(req.body).length === 0) {
            return next(new ErrorResponse("Request body cannot be empty", 400));
        }

       
        const value = await verifyEmailSchema.validateAsync(req.body, {
            
            abortEarly: false,
            
            // stripUnknown: true removes any fields not in schema
            // WHY? Security - prevents unexpected fields from being processed
            stripUnknown: true
        });
        res.send({
            success: true,
            message: "Email verified successfully"
        });

        // Replace request body with validated/sanitized data
        // WHY? Ensures only validated data proceeds to controller
        req.body = value;
        
        // Call next() to proceed to the next middleware or controller
        return next();
        
    } catch (error) {
        // Handle validation errors
        
        // If error has details property, it's a Joi validation error
        // Extract all error messages and join them
        const details = error?.details
            ? error.details.map((d) => d.message).join(", ")
            : error.message;
        
        // Remove backslashes and quotes from error message (cleaner output)
        const cleanedDetails = details.replace(/[\\"]/gi, "");
        
        // Return error to error handler middleware
        // 400 = Bad Request (client-side error)
        return next(
            new ErrorResponse(`Verify Email Validation Error: ${cleanedDetails}`, 400)
        );
    }
};

module.exports = validateVerifyEmailObj;