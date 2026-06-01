import {Router} from 'express';
import { createDepartmentHandler, getDepartmentHandler, updateDepartmentHandler, deleteDepartmentHandler } from './department.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { createDepartmentSchema, updateDepartmentSchema } from './department.validator';

const departmentRouter = Router();
departmentRouter.post('/', validateRequest(createDepartmentSchema), createDepartmentHandler);
departmentRouter.get('/', getDepartmentHandler);
departmentRouter.put('/:departmentId', validateRequest(updateDepartmentSchema), updateDepartmentHandler);
departmentRouter.delete('/:departmentId', deleteDepartmentHandler);

export default departmentRouter;
