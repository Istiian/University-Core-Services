import { integer, pgTable, varchar, date, pgEnum } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { offices } from './Office';

export const directors = pgTable('directors', {
    id: integer('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id),
    officeId: integer('office_id').notNull().references(() => offices.id),
    hireDate: date('hire_date').notNull(),
    status: varchar('status', { length: 255 }).notNull().default('active'),
});
