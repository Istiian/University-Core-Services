import { integer, pgTable, varchar, date, pgEnum } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { StatusEnum } from "./Enum";
import { departments } from "./Department";


export const faculty = pgTable('faculty', {
    id: integer('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id),
    hireDate: date('hire_date').notNull(),
    status: StatusEnum('status').notNull().default('active'),
    departmentId: integer('department_id').notNull().references(() => departments.id),
});