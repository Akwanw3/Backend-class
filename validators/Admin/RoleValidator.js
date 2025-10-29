const Joi = require("joi");
const ErrorResponse = require("../../utils/ErrorResponse");

/**
 * ========================================
 * ROLE VALIDATORS
 * ========================================
 * Validate input data for role operations
 */

/**
 * VALIDATE CREATE ROLE
 */
const createRoleSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.min': 'Role name must be at least 3 characters',
            'string.max': 'Role name must not exceed 30 characters',
            'any.required': 'Role name is required'
        }),
    
    description: Joi.string()
        .max(200)
        .optional()
        .messages({
            'string.max': 'Description must not exceed 200 characters'
        }),
    
    actions: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
        .optional()
        .messages({
            'string.pattern.base': 'Invalid action ID format'
        })
});

exports.validateCreateRole = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return next(new ErrorResponse("Request body cannot be empty", 400));
        }

        const value = await createRoleSchema.validateAsync(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        req.body = value;
        return next();

    } catch (error) {
        const details = error?.details
            ? error.details.map((d) => d.message).join(", ")
            : error.message;
        
        return next(new ErrorResponse(`Validation Error: ${details.replace(/[\\"]/gi, "")}`, 400));
    }
};

/**
 * VALIDATE UPDATE ROLE
 */
const updateRoleSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .optional()
        .messages({
            'string.min': 'Role name must be at least 3 characters',
            'string.max': 'Role name must not exceed 30 characters'
        }),
    
    description: Joi.string()
        .max(200)
        .optional()
        .allow('')
        .messages({
            'string.max': 'Description must not exceed 200 characters'
        }),
    
    isActive: Joi.boolean()
        .optional()
});

exports.validateUpdateRole = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return next(new ErrorResponse("Request body cannot be empty", 400));
        }

        const value = await updateRoleSchema.validateAsync(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        req.body = value;
        return next();

    } catch (error) {
        const details = error?.details
            ? error.details.map((d) => d.message).join(", ")
            : error.message;
        
        return next(new ErrorResponse(`Validation Error: ${details.replace(/[\\"]/gi, "")}`, 400));
    }
};

/**
 * VALIDATE ADD ACTION TO ROLE
 */
const addActionToRoleSchema = Joi.object({
    actionId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid action ID format',
            'any.required': 'Action ID is required'
        })
});

exports.validateAddActionToRole = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return next(new ErrorResponse("Request body cannot be empty", 400));
        }

        const value = await addActionToRoleSchema.validateAsync(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        req.body = value;
        return next();

    } catch (error) {
        const details = error?.details
            ? error.details.map((d) => d.message).join(", ")
            : error.message;
        
        return next(new ErrorResponse(`Validation Error: ${details.replace(/[\\"]/gi, "")}`, 400));
    }
};