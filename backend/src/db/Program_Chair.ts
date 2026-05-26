import { integer, pgTable, date } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import {courses} from "./Course";
import {StatusEnum} from "./Enum";


export const programChairs = pgTable('program_chairs', {
    id: integer('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id),
    courseId: integer('course_id').notNull().references(() => courses.id),
    startDate: date('start_date').notNull(),
    status: StatusEnum('status').notNull().default('active'),
});





