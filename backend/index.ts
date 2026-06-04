import express ,{Request, Response} from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import authRoutes from './src/modules/auth/auth.routes';
import courseRoutes from './src/modules/course/course.routes';
import studentRoutes from './src/modules/Student/student.router';
import departmentRoutes from './src/modules/department/department.routes';
import staffRoutes from './src/modules/Staff/staff.router';
import facultyRoutes from './src/modules/Faculty/faculty.router';
import deanRoutes from './src/modules/dean/dean.router';
import adminRoutes from './src/modules/admin/admin.router';
import programChairRoutes from './src/modules/program chair/programChair.router';
import { errorMiddleware } from './src/middleware/errorHandler';
import './src/middleware/passport';
import {rateLimit} from 'express-rate-limit';
import cors from 'cors';
import logger from './logger';

const app = express();
dotenv.config();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []; 
app.use(cors({
    origin: allowedOrigins
}));
app.use(limiter);
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/student',passport.authenticate('jwt', { session: false }), studentRoutes);
app.use('/api/course',passport.authenticate('jwt', { session: false }), courseRoutes);
app.use('/api/department', passport.authenticate('jwt', { session: false }), departmentRoutes);
app.use('/api/staff', passport.authenticate('jwt', { session: false }), staffRoutes);
app.use('/api/faculty', passport.authenticate('jwt', { session: false }), facultyRoutes);
app.use('/api/dean', passport.authenticate('jwt', { session: false }), deanRoutes);
app.use('/api/admin',passport.authenticate('jwt', { session: false }), adminRoutes);
app.use('/api/program-chair', passport.authenticate('jwt', { session: false }), programChairRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Worldd!');
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});


