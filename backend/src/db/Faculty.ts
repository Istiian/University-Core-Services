import { integer, pgTable, varchar, date, pgEnum, serial } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { EmployeeStatus, EmployeeType } from "./Enum";
import { departments } from "./Department";

export const faculty = pgTable('faculty', {
    facultyId: serial('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.personId, {onDelete: 'cascade'}).unique(),
    startDate: date('start_date').notNull(),
    status: EmployeeStatus('status').notNull().default('active'),
    type: EmployeeType('type').notNull(),
    departmentId: integer('department_id').notNull().references(() => departments.departmentId),
});
