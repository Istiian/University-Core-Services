import {Request, Response, NextFunction} from "express";
import {createUser, updateUserInfo, getUserById, listUsers} from "./user.service";
import {generateCredentialSlip} from "../../utils/credentialSlip";
import {ListFilters} from "./user.type";

export const registerUserHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const createdUser = await createUser(userData);
        const credentialSlip = generateCredentialSlip(createdUser.username, createdUser.password);
        res.setHeader('Content-Type', 'application/pdf');
        credentialSlip.pipe(res);
        credentialSlip.end();
    } catch (error) {
        next(error);
    }
}

export const updateUserInfoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Array.isArray(req.params.id) ? parseInt(req.params.id[0]) : parseInt(req.params.id);
        
        const userData = req.body;
        const updatedUser = await updateUserInfo(userId, userData);
        res.status(200).json({
            success: true,
            message: 'User information updated successfully',
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
}

export const getUserByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Array.isArray(req.params.id) ? parseInt(req.params.id[0]) : parseInt(req.params.id);
        const userInfo = await getUserById(userId);
        res.status(200).json({
            success: true,
            user: userInfo
        });
    } catch (error) {
        next(error);
    }
}

export const listUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        
        const filters: ListFilters = {};
        if (req.query.search) filters.search = req.query.search as string;
        if (req.query.role) filters.role = req.query.role as ListFilters['role'];
        const users = await listUsers(page, limit, filters);
        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            users
        });
    } catch (error) {
        next(error);
    }
}