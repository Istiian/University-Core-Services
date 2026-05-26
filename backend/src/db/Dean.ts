import { integer, pgTable, date } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { departments } from "./Department";
import { StatusEnum } from "./Enum";


export const deans = pgTable('deans', {
    id: integer('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id),
    startDate: date('start_date').notNull(),
    departmentId: integer('department_id').notNull().references(() => departments.id),
    status: StatusEnum('status').notNull().default('active'),
});

