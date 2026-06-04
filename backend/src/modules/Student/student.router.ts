import { Router } from 'express';
import { listStudentsHandler, updateStudentInfoHandler, deleteStudentHandler, getStudentByIdHandler, registerStudentHandler } from './student.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { registerStudentSchema, updateStudentSchema } from './student.validator';
import { hasPermission } from '../../middleware/hasPermission';

const router = Router();


router.get('/',listStudentsHandler);
router.post('/',hasPermission("personnel:create:any"), validateRequest(registerStudentSchema), registerStudentHandler);
router.put('/:studentId', hasPermission("personnel:update:any"), validateRequest(updateStudentSchema), updateStudentInfoHandler);
router.get('/:studentId', hasPermission("personnel:read:any", "personnel:read:self"), getStudentByIdHandler);
router.delete('/:studentId', hasPermission("personnel:delete:any"), deleteStudentHandler);

export default router;