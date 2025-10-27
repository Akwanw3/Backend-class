const asyncHandler = require("../middlewares/asyncHandler");
const { 
    login,
    register,
    verifyEmail,
} = require("../services/Auth");

exports.login = asyncHandler(async (req, res, next) => {
    const result = await login(req, res, next)
    res.status(200).json({
        "sucuess": true,
        "message": "Login Successful",
        "data": result
    })
});

exports.register = asyncHandler(async (req, res, next) => {
    const result = await register(req, res, next)
    res.status(200).json({
        "sucuess": true,
        "message": "Registration Successful",
        "data": result
    })
});
exports.verifyEmail = asyncHandler(async (req, res, next) => {
    const result = await verifyEmail(req, res, next)
    res.status(200).json({
        "sucuess": true,
        "message": "Email verification succesful",
        "data": result
    })
});