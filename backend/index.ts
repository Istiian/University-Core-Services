import express ,{Request, Response} from 'express';
import dotenv from 'dotenv';
import personRoutes from './src/modules/Person/person.routes';
import authRoutes from './src/modules/auth/auth.routes';
import courseRoutes from './src/modules/course/course.routes';
import studentRoutes from './src/modules/Student/student.router';
import departmentRoutes from './src/modules/department/department.routes';
import staffRoutes from './src/modules/Staff/staff.router';
import facultyRoutes from './src/modules/Faculty/faculty.router';
import { errorMiddleware } from './src/middleware/errorHandler';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/person', personRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/faculty', facultyRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Worldd!');
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


