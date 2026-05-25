import { integer, pgTable, varchar, date, pgEnum } from "drizzle-orm/pg-core";
import { persons } from "./Person";

const OfficeEnum = pgEnum('office', [
    'Registrar',
    'Accounting',
    'Human Resources',
    'IT Support',
    'Student Affairs',
    'Faculty Affairs',
    'Research and Development',
    'Library Services',
    'Facilities Management',
    'Security',
    'Finance',
    'Admissions',
    'Alumni Relations',
    'Public Relations',
    'Legal Affairs',
    'Academic Affairs',
    'Administrative Services'
]);

export const directors = pgTable('directors', {
    id: integer('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id),
    office: OfficeEnum('office').notNull(),
    hireDate: date('hire_date').notNull(),
    status: varchar('status', { length: 255 }).notNull().default('active'),
});
