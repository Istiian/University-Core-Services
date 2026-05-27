import {
    Router, 
    Request, 
    Response
} from "express";
import {
    registerStudentHandler,
    registerStaffHandler,
    registerAdminHandler,
    registerFacultyHandler,
    registerProgramChairHandler,
    registerDeanHandler

} from "./person.controller";

const router = Router();

router.post('/register/student', registerStudentHandler);
router.post('/register/staff', registerStaffHandler);
router.post('/register/admin', registerAdminHandler);
router.post('/register/faculty', registerFacultyHandler);
router.post('/register/dean', registerDeanHandler);
router.post('/register/program-chair', registerProgramChairHandler);


export default router;