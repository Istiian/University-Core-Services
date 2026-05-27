import express ,{Request, Response} from 'express';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import personRoutes from './src/modules/Person/person.routes';
import { errorMiddleware } from './src/middleware/errorHandler';
// import studentRoutes from './src/modules/Student/student.router';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/person', personRoutes);
// app.use('/api/student', studentRoutes);

export const db = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_URL!,
    
  }
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Worldd!');
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


