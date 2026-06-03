import { Router } from 'express';
import { createFacultyHandler, deleteFacultyHandler, listFacultiesHandler,getFacultyByIdHandler, updateFacultyHandler } from './faculty.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterFacultySchema, UpdateFacultySchema } from './faculty.validator';

const facultyRouter = Router();

facultyRouter.post('/', validateRequest(RegisterFacultySchema), createFacultyHandler);
facultyRouter.get('/', listFacultiesHandler);
facultyRouter.get('/:facultyId', getFacultyByIdHandler);
facultyRouter.put('/:facultyId', validateRequest(UpdateFacultySchema), updateFacultyHandler);
facultyRouter.delete('/:facultyId', deleteFacultyHandler);

export default facultyRouter;
