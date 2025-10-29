const Action = require("../../models/Action");
const Role = require("../../models/Role");
const ErrorResponse = require("../../utils/ErrorResponse");

/**
 * ===========================================
 * ACTION SERVICES
 * ===========================================
 * All business logic for managing actions (permissions)
 */

/**
 * CREATE ACTION
 * Admin can create a new action (permission)
 */
const createAction = async (req, res, next) => {
    try {
        const { name, description, category } = req.body;

        // Check if action already exists
        const existingAction = await Action.findOne({ name: name.toLowerCase() });
        if (existingAction) {
            throw new ErrorResponse(`Action '${name}' already exists`, 400);
        }

        // Create the action
        const action = await Action.create({
            name: name.toLowerCase(),
            description,
            category: category.toLowerCase()
        });

        return {
            data: action,
            metaData: {
                message: 'Action created successfully'
            }
        };

    } catch (error) {
        console.log(error);
        if (error instanceof ErrorResponse) {
            throw error;
        }
        throw new ErrorResponse(`Create Action Error: ${error.message}`, 500);
    }
};

/**
 * GET ALL ACTIONS
 * Admin can view all actions with pagination and filtering
 */
const getActions = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, category, isActive } = req.query;
        
        // Convert to numbers
        const limitNum = parseInt(limit);
        const pageNum = parseInt(page);
        const skip = limitNum * (pageNum - 1);

        // Build query
        const query = {};
        if (category) {
            query.category = category.toLowerCase();
        }
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        // Get actions
        const actions = await Action.find(query)
            .limit(limitNum)
            .skip(skip)
            .sort({ category: 1, name: 1 }); // Sort by category, then name

        // Get total count for pagination
        const totalActions = await Action.countDocuments(query);

        return {
            data: actions,
            metaData: {
                totalActions,
                limit: limitNum,
                totalPages: Math.ceil(totalActions / limitNum),
                currentPage: pageNum
            }
        };

    } catch (error) {
        console.log(error);
        throw new ErrorResponse(`Get Actions Error: ${error.message}`, 500);
    }
};

/**
 * GET SINGLE ACTION BY ID
 * Admin can view details of a specific action
 */
const getActionById = async (req, res, next) => {
    try {
        const { actionId } = req.params;

        const action = await Action.findById(actionId);

        if (!action) {
            throw new ErrorResponse('Action not found', 404);
        }

        // Get roles that have this action
        const rolesWithAction = await Role.find({ actions: actionId }).select('name description');

        return {
            data: {
                ...action.toObject(),
                assignedRoles: rolesWithAction
            },
            metaData: {}
        };

    } catch (error) {
        console.log(error);
        if (error instanceof ErrorResponse) {
            throw error;
        }
        throw new ErrorResponse(`Get Action Error: ${error.message}`, 500);
    }
};

/**
 * UPDATE ACTION
 * Admin can update action name, description, category, or toggle active status
 */
const updateAction = async (req, res, next) => {
    try {
        const { actionId } = req.params;
        const { name, description, category, isActive } = req.body;

        // Find action
        const action = await Action.findById(actionId);
        if (!action) {
            throw new ErrorResponse('Action not found', 404);
        }

        // Check if new name already exists (if name is being changed)
        if (name && name.toLowerCase() !== action.name) {
            const existingAction = await Action.findOne({ name: name.toLowerCase() });
            if (existingAction) {
                throw new ErrorResponse(`Action '${name}' already exists`, 400);
            }
            action.name = name.toLowerCase();
        }

        // Update other fields
        if (description !== undefined) action.description = description;
        if (category !== undefined) action.category = category.toLowerCase();
        if (isActive !== undefined) action.isActive = isActive;

        await action.save();

        return {
            data: action,
            metaData: {
                message: 'Action updated successfully'
            }
        };

    } catch (error) {
        console.log(error);
        if (error instanceof ErrorResponse) {
            throw error;
        }
        throw new ErrorResponse(`Update Action Error: ${error.message}`, 500);
    }
};

/**
 * DELETE ACTION
 * Admin can delete an action
 * Note: Should remove action from all roles before deleting
 */
const deleteAction = async (req, res, next) => {
    try {
        const { actionId } = req.params;

        const action = await Action.findById(actionId);
        if (!action) {
            throw new ErrorResponse('Action not found', 404);
        }

        // Remove this action from all roles that have it
        await Role.updateMany(
            { actions: actionId },
            { $pull: { actions: actionId } }
        );

        // Delete the action
        await Action.findByIdAndDelete(actionId);

        return {
            data: {
                actionId,
                name: action.name
            },
            metaData: {
                message: 'Action deleted successfully and removed from all roles'
            }
        };

    } catch (error) {
        console.log(error);
        if (error instanceof ErrorResponse) {
            throw error;
        }
        throw new ErrorResponse(`Delete Action Error: ${error.message}`, 500);
    }
};

/**
 * GET ACTIONS BY CATEGORY
 * Admin can get all actions grouped by category
 */
const getActionsByCategory = async (req, res, next) => {
    try {
        // Aggregate actions by category
        const actionsByCategory = await Action.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$category',
                    actions: {
                        $push: {
                            _id: '$_id',
                            name: '$name',
                            description: '$description'
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return {
            data: actionsByCategory,
            metaData: {
                totalCategories: actionsByCategory.length,
                totalActions: actionsByCategory.reduce((sum, cat) => sum + cat.count, 0)
            }
        };

    } catch (error) {
        console.log(error);
        throw new ErrorResponse(`Get Actions By Category Error: ${error.message}`, 500);
    }
};

module.exports = {
    createAction,
    getActions,
    getActionById,
    updateAction,
    deleteAction,
    getActionsByCategory
};