const asyncHandler = require("../middlewares/asyncHandler");

// Import Role Services
const {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
    addActionToRole,
    removeActionFromRole
} = require("../services/Admin/RoleServices");

// Import Action Services
const {
    createAction,
    getActions,
    getActionById,
    updateAction,
    deleteAction,
    getActionsByCategory
} = require("../services/Admin/ActionServices");

// Import existing user management services
const { deleteUser, getUser } = require("../services/Admin/Index");

/**
 * ========================================
 * ROLE CONTROLLERS
 * ========================================
 */

// Create a new role
exports.createRole = asyncHandler(async (req, res, next) => {
    const result = await createRole(req, res, next);
    res.status(201).json({
        success: true,
        message: "Role created successfully",
        data: result
    });
});

// Get all roles
exports.getRoles = asyncHandler(async (req, res, next) => {
    const result = await getRoles(req, res, next);
    res.status(200).json({
        success: true,
        message: "Roles retrieved successfully",
        data: result
    });
});

// Get single role by ID
exports.getRoleById = asyncHandler(async (req, res, next) => {
    const result = await getRoleById(req, res, next);
    res.status(200).json({
        success: true,
        message: "Role retrieved successfully",
        data: result
    });
});

// Update a role
exports.updateRole = asyncHandler(async (req, res, next) => {
    const result = await updateRole(req, res, next);
    res.status(200).json({
        success: true,
        message: "Role updated successfully",
        data: result
    });
});

// Delete a role
exports.deleteRole = asyncHandler(async (req, res, next) => {
    const result = await deleteRole(req, res, next);
    res.status(200).json({
        success: true,
        message: "Role deleted successfully",
        data: result
    });
});

// Add action to role
exports.addActionToRole = asyncHandler(async (req, res, next) => {
    const result = await addActionToRole(req, res, next);
    res.status(200).json({
        success: true,
        message: "Action added to role successfully",
        data: result
    });
});

// Remove action from role
exports.removeActionFromRole = asyncHandler(async (req, res, next) => {
    const result = await removeActionFromRole(req, res, next);
    res.status(200).json({
        success: true,
        message: "Action removed from role successfully",
        data: result
    });
});

/**
 * ========================================
 * ACTION CONTROLLERS
 * ========================================
 */

// Create a new action
exports.createAction = asyncHandler(async (req, res, next) => {
    const result = await createAction(req, res, next);
    res.status(201).json({
        success: true,
        message: "Action created successfully",
        data: result
    });
});

// Get all actions
exports.getActions = asyncHandler(async (req, res, next) => {
    const result = await getActions(req, res, next);
    res.status(200).json({
        success: true,
        message: "Actions retrieved successfully",
        data: result
    });
});

// Get single action by ID
exports.getActionById = asyncHandler(async (req, res, next) => {
    const result = await getActionById(req, res, next);
    res.status(200).json({
        success: true,
        message: "Action retrieved successfully",
        data: result
    });
});

// Update an action
exports.updateAction = asyncHandler(async (req, res, next) => {
    const result = await updateAction(req, res, next);
    res.status(200).json({
        success: true,
        message: "Action updated successfully",
        data: result
    });
});

// Delete an action
exports.deleteAction = asyncHandler(async (req, res, next) => {
    const result = await deleteAction(req, res, next);
    res.status(200).json({
        success: true,
        message: "Action deleted successfully",
        data: result
    });
});

// Get actions grouped by category
exports.getActionsByCategory = asyncHandler(async (req, res, next) => {
    const result = await getActionsByCategory(req, res, next);
    res.status(200).json({
        success: true,
        message: "Actions by category retrieved successfully",
        data: result
    });
});

/**
 * ========================================
 * USER MANAGEMENT CONTROLLERS
 * ========================================
 */

// Get users
exports.getUser = asyncHandler(async (req, res, next) => {
    const result = await getUser(req, res, next);
    res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result
    });
});

// Delete user
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const result = await deleteUser(req, res, next);
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result
    });
});