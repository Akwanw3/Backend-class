const express = require('express');

/**
 * WHAT IS EXPRESS ROUTER?
 * - Allows you to create modular route handlers
 * - Instead of defining all routes in app.js, you split them by feature
 * - Makes code more organized and maintainable
 * 
 * EXAMPLE WITHOUT ROUTER (messy):
 * app.post('/api/v1/auth/login', ...);
 * app.post('/api/v1/auth/register', ...);
 * app.post('/api/v1/user/profile', ...);
 * app.post('/api/v1/product/create', ...);
 * // Everything mixed together in one file!
 * 
 * EXAMPLE WITH ROUTER (clean):
 * routes/Auth.js handles all /auth routes
 * routes/User.js handles all /user routes
 * routes/Product.js handles all /product routes
 */

// Create a new router instance
// Think of router as a mini-application that handles a specific group of routes
const router = express.Router();

/**
 * IMPORT CONTROLLERS
 * Controllers handle the business logic for each route
 * They receive requests, process them, and send responses
 */
const {
    login,      // Handles user login
    register,   // Handles user registration
    verifyEmail // Handles email verification
} = require("../controller/Auth");

/**
 * IMPORT VALIDATORS
 * Validators check if incoming data is valid BEFORE reaching controllers
 * This is called "middleware" - runs between request and controller
 */
const { 
    validateLoginObj,       // Validates login data (email, password)
    validateRegisterObj,    // Validates registration data (all fields)
    validateVerifyEmailObj  // Validates verification data (email, OTP)
} = require('../validators/Auth');

/**
 * ==========================================
 * ROUTE DEFINITIONS
 * ==========================================
 * 
 * ROUTE STRUCTURE:
 * router.METHOD(PATH, MIDDLEWARE(S), CONTROLLER)
 * 
 * - METHOD: HTTP method (get, post, put, delete, patch)
 * - PATH: The URL endpoint
 * - MIDDLEWARE: Optional functions that run before controller (validators, auth checks, etc.)
 * - CONTROLLER: Final function that handles the request
 * 
 * MIDDLEWARE EXECUTION ORDER:
 * Request → Validator → Controller → Response
 * If validator fails, controller never runs
 */

/**
 * LOGIN ROUTE
 * 
 * FULL ENDPOINT: POST http://localhost:5005/api/v1/auth/login
 * 
 * REQUEST BODY:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * FLOW:
 * 1. Request comes to POST /api/v1/auth/login
 * 2. validateLoginObj middleware runs first
 *    - Checks if email is valid format
 *    - Checks if password is 8-50 characters
 *    - If invalid → returns error, stops here
 *    - If valid → proceeds to next step
 * 3. login controller runs
 *    - Finds user in database
 *    - Checks password
 *    - Generates JWT token
 *    - Returns user data and token
 * 
 * SUCCESS RESPONSE (200):
 * {
 *   "success": true,
 *   "message": "Login Successful",
 *   "data": {
 *     "data": { user object },
 *     "metaData": {
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *       "expiresIn": "7d",
 *       "tokenType": "Bearer"
 *     }
 *   }
 * }
 * 
 * ERROR RESPONSE (400/401):
 * {
 *   "success": false,
 *   "error": "Invalid email or password"
 * }
 */
router.post('/login', validateLoginObj, login);

/**
 * REGISTER ROUTE
 * 
 * FULL ENDPOINT: POST http://localhost:5005/api/v1/auth/register
 * 
 * REQUEST BODY:
 * {
 *   "firstname": "John",
 *   "lastname": "Doe",
 *   "email": "john@example.com",
 *   "password": "password123",
 *   "phone": "08012345678",
 *   "referredBy": "ABC123XYZ" (optional)
 * }
 * 
 * FLOW:
 * 1. Request comes to POST /api/v1/auth/register
 * 2. validateRegisterObj middleware runs
 *    - Validates all required fields
 *    - Checks field lengths and formats
 *    - If invalid → returns error
 *    - If valid → proceeds
 * 3. register controller runs
 *    - Checks if email already exists
 *    - Generates referral code for new user
 *    - Generates 6-digit OTP
 *    - Hashes password (done by User model pre-save hook)
 *    - Saves user to database
 *    - Sends verification email with OTP
 *    - Returns user data (without password)
 * 
 * SUCCESS RESPONSE (201):
 * {
 *   "success": true,
 *   "message": "Registration Successful. Please check your email for verification code.",
 *   "data": {
 *     "data": { user object },
 *     "metaData": {}
 *   }
 * }
 * 
 * NOTE: OTP is NOT returned in response (security)
 * User receives OTP via email
 */
router.post('/register', validateRegisterObj, register);

/**
 * VERIFY EMAIL ROUTE
 * 
 * FULL ENDPOINT: POST http://localhost:5005/api/v1/auth/verify-email
 * 
 * REQUEST BODY:
 * {
 *   "email": "john@example.com",
 *   "otp": "123456"
 * }
 * 
 * FLOW:
 * 1. After registration, user receives 6-digit OTP via email
 * 2. User sends POST request to /verify-email with email and OTP
 * 3. validateVerifyEmailObj middleware runs
 *    - Checks email format
 *    - Checks OTP is exactly 6 digits
 *    - Checks OTP contains only numbers
 *    - If invalid → returns error
 *    - If valid → proceeds
 * 4. verifyEmail controller runs
 *    - Hashes the provided OTP
 *    - Finds user with matching email and hashed OTP
 *    - If found and not already verified:
 *      - Sets isVerified to true
 *      - Clears verificationCode (OTP can't be reused)
 *      - Saves changes
 *    - Returns success response
 * 
 * SUCCESS RESPONSE (200):
 * {
 *   "success": true,
 *   "message": "Email Verified Successfully",
 *   "data": {
 *     "data": { user object with isVerified: true },
 *     "metaData": {
 *       "message": "Email verified successfully"
 *     }
 *   }
 * }
 * 
 * ERROR RESPONSES:
 * - 400: Invalid OTP or email
 * - 400: Email already verified
 */
router.post('/verify-email', validateVerifyEmailObj, verifyEmail);

/**
 * EXPORT THE ROUTER
 * 
 * This router is imported in app.js as:
 * app.use("/api/v1/auth", authRoute);
 * 
 * So the full URLs become:
 * - POST /api/v1/auth/login
 * - POST /api/v1/auth/register
 * - POST /api/v1/auth/verify-email
 * 
 * WHY THIS STRUCTURE?
 * - Organized: All auth routes in one place
 * - Scalable: Easy to add more auth routes
 * - RESTful: Follows REST API best practices
 * - Maintainable: Each route clearly defined with validators and controllers
 */
module.exports = router;