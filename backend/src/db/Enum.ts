import {pgEnum } from "drizzle-orm/pg-core";

export const StatusEnum = pgEnum('StatusEnum', [
    'active',
    'inactive'
]);

export const student_typeEnum = pgEnum('student_type', [
    'regular',
    'irregular'
]);