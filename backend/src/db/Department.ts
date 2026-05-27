import { integer, pgTable, varchar,  } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { faculty } from "./Faculty";
import { courses } from "./Course";
import { deans } from "./Dean"; 

export const departments = pgTable('departments', {
    id: integer('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
});

export const departmentsRelations = relations(departments, ({ many }) => ({
    deans: many(deans),
    faculty: many(faculty),
    courses: many(courses)
}));