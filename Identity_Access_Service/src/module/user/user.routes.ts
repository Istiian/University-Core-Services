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

const router = Router();

// Create a new user
router.post('/', 
    validateRequest(CreateUserRequestSchema), 
    registerUserHandler);

// Update user information
router.patch('/:id', 
    validateRequest(UpdateUserRequestSchema), 
    updateUserInfoHandler);

// Get user by ID and list users
router.get('/:id', 
    getUserByIdHandler);

// List all users
router.get('/',
    listUsersHandler);


export default router;