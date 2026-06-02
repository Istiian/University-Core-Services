import { Router } from 'express';
import { createAdminHandler, deleteAdminHandler, getAdminHandler, updateAdminHandler } from './admin.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterAdminSchema, UpdateAdminSchema } from './admin.validator';

const adminRouter = Router();

adminRouter.post('/', validateRequest(RegisterAdminSchema), createAdminHandler);
adminRouter.get('/', getAdminHandler);
adminRouter.put('/:adminId', validateRequest(UpdateAdminSchema), updateAdminHandler);
adminRouter.delete('/:adminId', deleteAdminHandler);

export default adminRouter;