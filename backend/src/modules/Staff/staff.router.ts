import { Router } from 'express';
import { createStaffHandler, listStaffHandler, updateStaffHandler, deleteStaffHandler } from './staff.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterStaffSchema, UpdateStaffSchema } from './staff.validator';

const router = Router();

router.post('/', validateRequest(RegisterStaffSchema), createStaffHandler);
router.get('/', listStaffHandler);
router.get('/:staffId', listStaffHandler);
router.put('/:staffId', validateRequest(UpdateStaffSchema), updateStaffHandler);
router.delete('/:staffId', deleteStaffHandler);

export default router;
