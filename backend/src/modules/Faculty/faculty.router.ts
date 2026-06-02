import { Router } from 'express';
import { createFacultyHandler, deleteFacultyHandler, getFacultyHandler, updateFacultyHandler } from './faculty.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterFacultySchema, UpdateFacultySchema } from './faculty.validator';

const facultyRouter = Router();

facultyRouter.post('/', validateRequest(RegisterFacultySchema), createFacultyHandler);
facultyRouter.get('/', getFacultyHandler);
facultyRouter.put('/:facultyId', validateRequest(UpdateFacultySchema), updateFacultyHandler);
facultyRouter.delete('/:facultyId', deleteFacultyHandler);

export default facultyRouter;
