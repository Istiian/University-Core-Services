import {Router} from 'express';
import { createCourseHandler, getCourseHandler, updateCourseHandler, deleteCourseHandler } from './course.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { createCourseSchema, updateCourseSchema } from './course.validator';
const courseRouter = Router();

courseRouter.post('/', validateRequest(createCourseSchema), createCourseHandler);
courseRouter.get('/', getCourseHandler);
courseRouter.put('/:courseId', validateRequest(updateCourseSchema), updateCourseHandler);
courseRouter.delete('/:courseId', deleteCourseHandler);

export default courseRouter;