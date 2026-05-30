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
import "../../../passport";
import { validateRequest } from "../../middleware/validateRequest";
import passport from "passport";
import {
    registerStudentSchema,
    registerStaffSchema,
    registerFacultySchema, registerAdminSchema,
    registerDeanSchema,
    registerProgramChairSchema,
} from "./person.validation";
const router = Router();

// router.use(passport.authenticate('jwt', { session: false }));


router.post('/register/student', validateRequest(registerStudentSchema), registerStudentHandler);
router.post('/register/staff', validateRequest(registerStaffSchema), registerStaffHandler);
router.post('/register/admin', validateRequest(registerAdminSchema), registerAdminHandler);
router.post('/register/faculty', validateRequest(registerFacultySchema), registerFacultyHandler);
router.post('/register/dean', validateRequest(registerDeanSchema), registerDeanHandler);
router.post('/register/program-chair', validateRequest(registerProgramChairSchema), registerProgramChairHandler);


export default router;