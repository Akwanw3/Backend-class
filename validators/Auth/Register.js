const Joi = require("joi");
const ErrorResponse = require("../../utils/ErrorResponse");

const registerSchema = Joi.object(
    {
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(20).required(),
        firstname: Joi.string().min(5).max(50).required(),
        lastname: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(11).max(15).optional(),
        referredBy: Joi.string().min(12).max(20).optional(),
    }
);


const validateRegisterObj = async (req, res, next) => {
    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            return next(new ErrorResponse("Request body cannot be empty", 400));
        }
        const value = await registerSchema.validateAsync(req.body);
        req.body = value;
        return next();
    }
    catch (error) {

        const details = error?.details
        ? error.details.map((d) => d.message).join(", ")
        : error.message;
       
        return next(new ErrorResponse(`Register Validation Error: ${details.replace(/[\\"]/gi, "")}`, 400));
    }
}


module.exports = validateRegisterObj;