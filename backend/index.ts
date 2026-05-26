import express ,{Request, Response} from 'express';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import personRoutes from './src/modules/Person/person.routes';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api/person', personRoutes);

const db = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_URL!,
    ssl: true
  }
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Worldd!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


