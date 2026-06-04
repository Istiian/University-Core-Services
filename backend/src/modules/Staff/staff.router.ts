import { Router } from 'express';
import { createStaffHandler, listStaffHandler, getStaffByIdHandler, updateStaffHandler, deleteStaffHandler } from './staff.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterStaffSchema, UpdateStaffSchema } from './staff.validator';
import { hasPermission } from '../../middleware/hasPermission';

const router = Router();


router.post('/', hasPermission("personnel:create:any"), validateRequest(RegisterStaffSchema), createStaffHandler);
router.get('/', hasPermission("personnel:read:any"), listStaffHandler);
router.get('/:staffId', hasPermission("personnel:read:any", "personnel:read:self"), getStaffByIdHandler);
router.put('/:staffId', hasPermission("personnel:update:any"), validateRequest(UpdateStaffSchema), updateStaffHandler);
router.delete('/:staffId', hasPermission("personnel:delete:any"), deleteStaffHandler);

export default router;
