import { relations } from 'drizzle-orm';
import { persons } from './Person';
import { admins } from './Admin';
import { deans } from './Dean';
import { faculty } from './Faculty';
import { programChairs } from './Program_Chair';
import { staff } from './Staff';
import { students } from './Student';
import { offices } from './Office';
import { courses } from './Course';
import { departments } from './Department';

export const personsRelations = relations(persons, ({ one }) => ({
  admin: one(admins,{
    fields: [persons.personId], 
    references: [admins.personId]
  }),
  dean: one(deans,{
    fields: [persons.personId], 
    references: [deans.personId]
  }),
  faculty: one(faculty,{
    fields: [persons.personId], 
    references: [faculty.personId]
  }),
  programChair: one(programChairs,{
    fields: [persons.personId], 
    references: [programChairs.personId]
  }),
  staff: one(staff,{
    fields: [persons.personId], 
    references: [staff.personId]
  }),
  student: one(students,{
    fields: [persons.personId], 
    references: [students.personId]
  }),
}));

export const adminsRelations = relations(admins, ({ one }) => ({
  person: one(persons, {
    fields: [admins.personId], 
    references: [persons.personId]
  }),
  office: one(offices,{
    fields: [admins.officeId],
    references: [offices.officeId]
  }),
}));

export const deansRelations = relations(deans, ({ one }) => ({
  person: one(persons, {
    fields: [deans.personId], 
    references: [persons.personId]
  }),
  department: one(departments,{
    fields: [deans.departmentId], 
    references: [departments.departmentId]
  }),
}));

export const facultyRelations = relations(faculty, ({ one }) => ({
  person: one(persons, {
    fields: [faculty.personId], 
    references: [persons.personId]
  }),
  department: one(departments,{
    fields: [faculty.departmentId], 
    references: [departments.departmentId]
  }),
}));

export const programChairsRelations = relations(programChairs, ({ one }) => ({
  person: one(persons, {
    fields: [programChairs.personId], 
    references: [persons.personId]
  }),
  course: one(courses,{
    fields: [programChairs.courseId], 
    references: [courses.courseId]
  }),
}));

export const staffRelations = relations(staff, ({ one }) => ({
  person: one(persons, {
    fields: [staff.personId], 
    references: [persons.personId]
  }),
  office: one(offices,{
    fields: [staff.officeId],
    references: [offices.officeId]
  }),
}));

export const studentsRelations = relations(students, ({ one }) => ({
  person: one(persons, {
    fields: [students.personId], 
    references: [persons.personId]
  }),
  course: one(courses, {
    fields: [students.courseId], 
    references: [courses.courseId ]
  }),
}));

export const officesRelations = relations(offices, ({ many }) => ({
  admins: many(admins),
  staff: many(staff),
}));

export const coursesRelations = relations(courses, ({ one }) => ({
  department: one(departments,{
    fields: [courses.departmentId], 
    references: [departments.departmentId]
  }),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
  deans: many(deans),
  faculty: many(faculty),
  courses: many(courses),
}));
