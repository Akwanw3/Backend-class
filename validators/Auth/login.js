const Joi = require("joi");
const ErrorResponse = require("../../utils/ErrorResponse");

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(50).required()
});


const validateLoginObj = async (req, res, next) => {
    try {
        const value = await loginSchema.validateAsync(req.body);
        req.body = value;
        next();
    }
    catch (error) {
        throw new ErrorResponse(`Login Validation Error: ${error}`, 400);
     }
}

module.exports = validateLoginObj;