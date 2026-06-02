import { Router } from 'express';
import { createStaffHandler, getStaffHandler, updateStaffHandler, deleteStaffHandler } from './staff.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterStaffSchema, UpdateStaffSchema } from './staff.validator';

const staffRouter = Router();

staffRouter.post('/', validateRequest(RegisterStaffSchema), createStaffHandler);
staffRouter.get('/', getStaffHandler);
staffRouter.put('/:staffId', validateRequest(UpdateStaffSchema), updateStaffHandler);
staffRouter.delete('/:staffId', deleteStaffHandler);

export default staffRouter;
