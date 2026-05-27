import { integer, pgTable, varchar, date, pgEnum } from "drizzle-orm/pg-core";
import { departments } from "./Department";
import { relations } from "drizzle-orm";
import { programChairs } from "./Program_Chair";

export const courses = pgTable('courses', {
    id: integer('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    departmentId: integer('department_id').notNull().references(() => departments.id),
});

export const coursesRelations = relations(courses, ({ one }) => ({
    department: one(departments),
}));