import { pgEnum } from "drizzle-orm/pg-core";

export const StudentStatus = pgEnum("StudentStatus", [
    "active",
    "graduated",
    "dropped",
    "suspended"
]);

export const StudentType = pgEnum("StudentType", [
    "regular",
    "irregular"
]);

export const EmployeeStatus = pgEnum("EmployeeStatus", [
    "active",
    "suspended",
    "terminated",
    "retired",
    "resigned"
]);

export const EmployeeType = pgEnum("EmployeeType", [
    "Full-time",
    "Part-time",
    "Contractual"
]);

export const personRole = pgEnum("personRole", [
    "student",
    "faculty",
    "admin",
    "dean",
    "programChair",
    "staff"
]);

