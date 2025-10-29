const Role = require("../../models/Roles")
const Action = require("../../models/Action");
const ErrorResponse = require("../../utils/ErrorResponse");

/**
 * ===========================================
 * ROLE SERVICES
 * ===========================================
 * All business logic for managing roles
 */

/**
 * CREATE ROLE
 * Admin can create a new role with specified actions
 */
const createRole = async (req, res, next) => {
    try {
        const { name, description, actions } = req.body;

        // Check if role already exists
        const existingRole = await Role.findOne({ name: name.toLowerCase() });
        if (existingRole) {
            throw new ErrorResponse(`Role '${name}' already exists`, 400);
        }

        // If actions are provided, verify they exist
        if (actions && actions.length > 0) {
            const actionIds = await Action.find({ _id: { $in: actions } }).select('_id');
            if (actionIds.length !== actions.length) {
                throw new ErrorResponse('One or more action IDs are invalid', 400);
            }
        }

        // Create the role
        const role = await Role.create({
            name: name.toLowerCase(),
            description,
            actions: actions || []
        });

        // Populate actions to return full action details
        const populatedRole = await Role.findById(role._id).populate('actions');

        return {
            data: populatedRole,
            metaData: {
                message: 'Role created successfully'
            }
        };

    } catch (error) {
        console.log(error);
        if (error instanceof ErrorResponse) {
            throw error;
        }
        throw new ErrorResponse(`Create Role Error: ${error.message}`, 500);
    }
};

/**
 * GET ALL ROLES
 * Admin can view all roles with pagination
 */
const getRoles = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, isActive } = req.query;
        
        // Convert to numbers
        const limitNum = parseInt(limit);
        const pageNum = parseInt(page);
        const skip = limitNum * (pageNum - 1);

        // Build query
        const query = {};
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        // Get roles with actions populated
        const roles = await Role.find(query)
            .populate('actions')
            .limit(limitNum)
            .skip(skip)
            .sort({ createdAt: -1 });

        // Get total count for pagination
        const totalRoles = await Role.countDocuments(query);

        return {
            data: roles,
            metaData: {
                totalRoles,
                limit: limitNum,
                totalPages: Math.ceil(totalRoles / limitNum),
                currentPage: pageNum
            }
        };

    } catch (error) {
        console.log(error);
        throw new ErrorResponse(`Get Roles Error: ${error.message}`, 500);
    }
};

/**
 * GET SINGLE ROLE BY ID
 * Admin can view details of a specific role
 */
const getRoleById = async (req, res, next) => {
    try {
        const { roleId } = req.params;

        const role = await Role.findById(roleId).populate('actions');

        if (!role) {
            throw new ErrorResponse('Role not found', 404);
        }

        return {
            data: role,
            metaData: {}
        };

    } catch (error) {
        console.log(error);
        if (error instanceof ErrorResponse) {
            throw error;
        }
        throw new ErrorResponse(`Get Role Error: ${error.message}`, 500);
    }
};

/**
 * UPDATE ROLE
 * Admin can update role name, description, or toggle active status
 */
const updateRole = async (req, res, next) => {
    try {
        const { roleId } = req.params;
        const { name, description, isActive } = req.body;

        // Find role
        const role = await Role.findById(roleId);
        if (!role) {
            throw new ErrorResponse('Role not found', 404);
        }

        // Check if new name already exists (if name is being changed)
        if (name && name.toLowerCase() !== role.name) {
            const existingRole = await Role.findOne({ name: name.toLowerCase() });
            if (existingRole) {
                throw new ErrorResponse(`Role '${name}' already exists`, 400);
            }
            role.name = name.toLowerCase();
        }

        // Update other fields
        if (description !== undefined) role.description = description;
        if (isActive !== undefined) role.isActive = isActive;

        await role.save();

        // Return updated role with populated actions
        const updatedRole = await Role.findById(roleId).populate('actions');

        return {
            data: updatedRole,
            metaData: {
                message: 'Role updated successfully'
            }
        };

    } catch (error) {
        console.log(error);
        if (error instanceof ErrorResponse) {
            throw error;
        }
        throw new ErrorResponse(`Update Role Error: ${error.message}`, 500);
    }
};

/**
 * DELETE ROLE
 * Admin can delete a role
 * Note: Should check if role is assigned to users before deleting
 */
const deleteRole = async (req, res, next) => {
    try {
        const { roleId } = req.params;

        const role = await Role.findById(roleId);
        if (!role) {
            throw new ErrorResponse('Role not found', 404);
        }

        // TODO: Check if role is assigned to any users
         const usersWithRole = await User.find({ Role: roleId });
         if (usersWithRole.length > 0) {
             throw new ErrorResponse('Cannot delete role that is assigned to users', 400);
        }

        await Role.findByIdAndDelete(roleId);

        return {
            data: {
                roleId,
                name: role.name
            },
            metaData: {
                message: 'Role deleted successfully'
            }
        };

    } catch (error) {
        console.log(error);
        if (error instanceof ErrorResponse) {
            throw error;
        }
        throw new ErrorResponse(`Delete Role Error: ${error.message}`, 500);
    }
};

/**
 * ADD ACTION TO ROLE
 * Admin can add an action (permission) to a role
 */
const addActionToRole = async (req, res, next) => {
    try {
        const { roleId } = req.params;
        const { actionId } = req.body;

        // Find role
        const role = await Role.findById(roleId);
        if (!role) {
            throw new ErrorResponse('Role not found', 404);
        }

        // Find action
        const action = await Action.findById(actionId);
        if (!action) {
            throw new ErrorResponse('Action not found', 404);
        }

        // Check if action already exists in role
        if (role.actions.includes(actionId)) {
            throw new ErrorResponse('Action already exists in this role', 400);
        }

        // Add action to role
        role.actions.push(actionId);
        await role.save();

        // Return updated role with populated actions
        const updatedRole = await Role.findById(roleId).populate('actions');

        return {
            data: updatedRole,
            metaData: {
                message: `Action '${action.name}' added to role '${role.name}'`
            }
        };

    } catch (error) {
        console.log(error);
        if (error instanceof ErrorResponse) {
            throw error;
        }
        throw new ErrorResponse(`Add Action to Role Error: ${error.message}`, 500);
    }
};

/**
 * REMOVE ACTION FROM ROLE
 * Admin can remove an action (permission) from a role
 */
const removeActionFromRole = async (req, res, next) => {
    try {
        const { roleId, actionId } = req.params;

        // Find role
        const role = await Role.findById(roleId);
        if (!role) {
            throw new ErrorResponse('Role not found', 404);
        }

        // Check if action exists in role
        if (!role.actions.includes(actionId)) {
            throw new ErrorResponse('Action not found in this role', 404);
        }

        // Remove action from role
        role.actions = role.actions.filter(
            action => action.toString() !== actionId.toString()
        );
        await role.save();

        // Return updated role with populated actions
        const updatedRole = await Role.findById(roleId).populate('actions');

        return {
            data: updatedRole,
            metaData: {
                message: 'Action removed from role successfully'
            }
        };

    } catch (error) {
        console.log(error);
        if (error instanceof ErrorResponse) {
            throw error;
        }
        throw new ErrorResponse(`Remove Action from Role Error: ${error.message}`, 500);
    }
};

module.exports = {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
    addActionToRole,
    removeActionFromRole
};