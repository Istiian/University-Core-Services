import { Router } from 'express';
import { createAdminHandler, deleteAdminHandler, listAdminsHandler, getAdminByIdHandler, updateAdminHandler } from './admin.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterAdminSchema, UpdateAdminSchema } from './admin.validator';
import { hasPermission } from '../../middleware/hasPermission';
const adminRouter = Router();

adminRouter.post('/', validateRequest(RegisterAdminSchema), createAdminHandler);
adminRouter.get('/', hasPermission("personnel:read:any"), listAdminsHandler);
adminRouter.get('/:adminId', hasPermission("personnel:read:any", "personnel:read:self"), getAdminByIdHandler);
adminRouter.put('/:adminId', hasPermission("personnel:update:any"), validateRequest(UpdateAdminSchema), updateAdminHandler);
adminRouter.delete('/:adminId', hasPermission("personnel:delete:any"), deleteAdminHandler);

export default adminRouter;