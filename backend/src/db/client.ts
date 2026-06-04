import dotenv from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import logger from '../../logger';

dotenv.config();

if (!process.env.DATABASE_URL) {
    logger.warn('DATABASE_URL is not set; pg Pool may fail to connect.');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });