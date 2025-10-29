const express = require('express');
const router = express.Router();

/**
 * IMPORT CONTROLLERS
 */
const {
    // Role controllers
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
    addActionToRole,
    removeActionFromRole,
    
    // Action controllers
    createAction,
    getActions,
    getActionById,
    updateAction,
    deleteAction,
    getActionsByCategory,
    
    // User management controllers
    getUser,
    deleteUser
} = require("../controller/Admin");

/**
 * IMPORT VALIDATORS
 */
const {
    validateCreateRole,
    validateUpdateRole,
    validateAddActionToRole
} = require("../validators/Admin/RoleValidators");

const {
    validateCreateAction,
    validateUpdateAction
} = require("../validators/Admin/ActionValidators");

/**
 * ========================================
 * ROLE ROUTES
 * ========================================
 * 
 * These routes allow admins to manage roles in the system
 */

/**
 * CREATE ROLE
 * POST /api/v1/admin/roles
 * 
 * Request Body:
 * {
 *   "name": "moderator",
 *   "description": "Can moderate content",
 *   "actions": ["action_id_1", "action_id_2"] // Optional
 * }
 */
router.post('/roles', validateCreateRole, createRole);

/**
 * GET ALL ROLES
 * GET /api/v1/admin/roles
 * 
 * Query Params:
 * - limit: Number of roles per page (default: 10)
 * - page: Page number (default: 1)
 * - isActive: Filter by active status (true/false)
 * 
 * Example: GET /api/v1/admin/roles?limit=20&page=1&isActive=true
 */
router.get('/roles', getRoles);

/**
 * GET SINGLE ROLE
 * GET /api/v1/admin/roles/:roleId
 * 
 * Example: GET /api/v1/admin/roles/507f1f77bcf86cd799439011
 */
router.get('/roles/:roleId', getRoleById);

/**
 * UPDATE ROLE
 * PUT /api/v1/admin/roles/:roleId
 * 
 * Request Body (all fields optional):
 * {
 *   "name": "senior_moderator",
 *   "description": "Senior content moderator",
 *   "isActive": true
 * }
 */
router.put('/roles/:roleId', validateUpdateRole, updateRole);

/**
 * DELETE ROLE
 * DELETE /api/v1/admin/roles/:roleId
 * 
 * Example: DELETE /api/v1/admin/roles/507f1f77bcf86cd799439011
 */
router.delete('/roles/:roleId', deleteRole);

/**
 * ADD ACTION TO ROLE
 * POST /api/v1/admin/roles/:roleId/actions
 * 
 * Request Body:
 * {
 *   "actionId": "507f1f77bcf86cd799439011"
 * }
 */
router.post('/roles/:roleId/actions', validateAddActionToRole, addActionToRole);

/**
 * REMOVE ACTION FROM ROLE
 * DELETE /api/v1/admin/roles/:roleId/actions/:actionId
 * 
 * Example: DELETE /api/v1/admin/roles/507f1f77bcf86cd799439011/actions/507f191e810c19729de860ea
 */
router.delete('/roles/:roleId/actions/:actionId', removeActionFromRole);

/**
 * ========================================
 * ACTION ROUTES
 * ========================================
 * 
 * These routes allow admins to manage actions (permissions) in the system
 */

/**
 * CREATE ACTION
 * POST /api/v1/admin/actions
 * 
 * Request Body:
 * {
 *   "name": "delete_user",
 *   "description": "Ability to delete users",
 *   "category": "user_management"
 * }
 * 
 * Categories: user_management, content_management, analytics, settings, reports, other
 */
router.post('/actions', validateCreateAction, createAction);

/**
 * GET ALL ACTIONS
 * GET /api/v1/admin/actions
 * 
 * Query Params:
 * - limit: Number of actions per page (default: 10)
 * - page: Page number (default: 1)
 * - category: Filter by category
 * - isActive: Filter by active status (true/false)
 * 
 * Example: GET /api/v1/admin/actions?category=user_management&limit=20
 */
router.get('/actions', getActions);

/**
 * GET ACTIONS BY CATEGORY
 * GET /api/v1/admin/actions/by-category
 * 
 * Returns all actions grouped by their categories
 */
router.get('/actions/by-category', getActionsByCategory);

/**
 * GET SINGLE ACTION
 * GET /api/v1/admin/actions/:actionId
 * 
 * Example: GET /api/v1/admin/actions/507f1f77bcf86cd799439011
 * Also shows which roles have this action
 */
router.get('/actions/:actionId', getActionById);

/**
 * UPDATE ACTION
 * PUT /api/v1/admin/actions/:actionId
 * 
 * Request Body (all fields optional):
 * {
 *   "name": "delete_any_user",
 *   "description": "Ability to delete any user including admins",
 *   "category": "user_management",
 *   "isActive": true
 * }
 */
router.put('/actions/:actionId', validateUpdateAction, updateAction);

/**
 * DELETE ACTION
 * DELETE /api/v1/admin/actions/:actionId
 * 
 * Example: DELETE /api/v1/admin/actions/507f1f77bcf86cd799439011
 * This will also remove the action from all roles that have it
 */
router.delete('/actions/:actionId', deleteAction);

/**
 * ========================================
 * USER MANAGEMENT ROUTES
 * ========================================
 */

/**
 * GET USERS
 * GET /api/v1/admin/users
 * 
 * Query Params:
 * - limit: Number of users per page (default: 10)
 * - page: Page number (default: 1)
 */
router.get('/users', getUser);

/**
 * DELETE USER
 * DELETE /api/v1/admin/users
 * 
 * Query Params:
 * - userId: ID of user to delete
 * 
 * Example: DELETE /api/v1/admin/users?userId=507f1f77bcf86cd799439011
 */
router.delete('/users', deleteUser);

module.exports = router;