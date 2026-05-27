import { integer, pgTable, varchar, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { admins } from "./Admin";
import { deans } from "./Dean";
import { faculty } from "./Faculty";
import { programChairs } from "./Program_Chair";
import { staff } from "./Staff";
import { students } from "./Student";

export const persons = pgTable('persons', {
    id: integer('id').primaryKey(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    middleName: varchar('middle_name', { length: 255 }),
    birthDate: date('birth_date').notNull(),
    contactNumber: varchar('contact_number', { length: 20 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    houseNumber: varchar('house_number', { length: 255 }).notNull(),
    street: varchar('street', { length: 255 }).notNull(),
    barangay: varchar('barangay', { length: 255 }).notNull(),
    cityMunicipality: varchar('city_municipality', { length: 255 }).notNull(),
    region: varchar('region', { length: 255 }).notNull(),
});

export const personsRelations = relations(persons, ({ one }) => ({
    admin: one(admins),
    dean: one(deans),
    faculty: one(faculty),
    programChair: one(programChairs),
    staff: one(staff),
    student: one(students),
}));



