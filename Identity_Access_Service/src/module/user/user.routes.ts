import {
    registerUserHandler,
    updateUserInfoHandler,
    getUserByIdHandler,
    listUsersHandler
} from "./user.controller";
import {
    CreateUserRequestSchema,
    UpdateUserRequestSchema
} from "./user.validator";
import { validateRequest } from "../../middleware/validateRequest";
import { Router } from "express";
import { checkPermission } from "../../middleware/checkPermission";

const router = Router();

// Create a new user
router.post('/',
    checkPermission('SuperAdmin', 'Admin'),
    validateRequest(CreateUserRequestSchema),
    registerUserHandler);

// Update user information
router.patch('/:id',
    checkPermission('SuperAdmin', 'Admin', 'Self'),
    validateRequest(UpdateUserRequestSchema),
    updateUserInfoHandler);

// Get user by ID
router.get('/:id',
    checkPermission('SuperAdmin', 'Admin', 'Self'),
    getUserByIdHandler);

// List all users
router.get('/',
    checkPermission('SuperAdmin', 'Admin'),
    listUsersHandler);


export default router;