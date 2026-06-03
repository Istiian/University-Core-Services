import { Router } from 'express';
import { createAdminHandler, deleteAdminHandler, listAdminsHandler, getAdminByIdHandler, updateAdminHandler } from './admin.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterAdminSchema, UpdateAdminSchema } from './admin.validator';

const adminRouter = Router();

adminRouter.post('/', validateRequest(RegisterAdminSchema), createAdminHandler);
adminRouter.get('/', listAdminsHandler);
adminRouter.get('/:adminId', getAdminByIdHandler);
adminRouter.put('/:adminId', validateRequest(UpdateAdminSchema), updateAdminHandler);
adminRouter.delete('/:adminId', deleteAdminHandler);

export default adminRouter;