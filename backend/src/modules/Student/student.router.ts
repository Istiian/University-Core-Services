import { Router } from 'express';
import { listStudentsHandler, registerStudentHandler, updateStudentInfoHandler, deleteStudentHandler, getStudentByIdHandler } from './student.controller';
import { validateRequest } from '../../middleware/validateRequest';
import {  registerStudentSchema, updateStudentSchema } from './student.validator';
import { hasPermission } from '../../middleware/hasPermission';
const router = Router();


router.get('/', hasPermission("personnel:read:any"), listStudentsHandler);
router.post('/', validateRequest(registerStudentSchema), registerStudentHandler);
router.put('/:studentId',hasPermission("personnel:update:self"), validateRequest(updateStudentSchema), updateStudentInfoHandler);
router.get('/:studentId', hasPermission("personnel:read:self"), getStudentByIdHandler);
router.delete('/:studentId', deleteStudentHandler);

export default router;