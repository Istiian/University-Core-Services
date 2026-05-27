// import { Request, Response } from 'express';
// import {registerStudent} from './student.service';
// import  logger  from '../../../logger'

// export const registerStudentHandler = async (req: Request, res: Response) => {
//     try {
//         const student = req.body;
//         await registerStudent(student);
//         res.status(201).json({ message: 'Student registered successfully' });
//     } catch (error) {
//         logger.error('Error registering student:', error);

//         if (error instanceof Error && error.message.startsWith('Validation error:')) {
//             return res.status(400).json({ message: error.message.replace('Validation error: ', '') });
//         }

//         res.status(500).json({ message: 'Failed to register student' });
//     }
// }
