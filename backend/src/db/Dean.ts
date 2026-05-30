import { integer, pgTable, date, serial } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { departments } from "./Department";
import { EmployeeStatus, EmployeeType } from "./Enum";

export const deans = pgTable('deans', {
    deanId: serial('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.personId,{onDelete: 'cascade'}).unique(),
    startDate: date('start_date').notNull(),
    departmentId: integer('department_id').notNull().references(() => departments.departmentId),
    status: EmployeeStatus('status').notNull().default('active'),
    type: EmployeeType('type').notNull()
});
