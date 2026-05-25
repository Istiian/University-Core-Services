import { integer, pgTable, varchar, date, pgEnum } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { departments } from "./College_Department";

const deanStatusEnum = pgEnum('dean_status', [
    'active',
    'inactive'
]);

export const deans = pgTable('deans', {
    id: integer('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id),
    startDate: date('start_date').notNull(),
    departmentId: integer('department_id').notNull().references(() => departments.id),
    status: deanStatusEnum('status').notNull().default('active'),
});

