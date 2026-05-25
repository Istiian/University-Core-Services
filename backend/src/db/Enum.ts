import {pgEnum } from "drizzle-orm/pg-core";

export const OfficeEnum = pgEnum('office', [
    'Registrar',
    'Accounting',
    'Human Resources',
    'IT Support',
    'Student Affairs',
    'Faculty Affairs',
    'Research and Development',
    'Library Services',
    'Facilities Management',
    'Security',
    'Finance',
    'Admissions',
    'Alumni Relations',
    'Public Relations',
    'Legal Affairs',
    'Academic Affairs',
    'Administrative Services'
]);

export const StatusEnum = pgEnum('StatusEnum', [
    'active',
    'inactive'
]);

export const departmentEnum = pgEnum('department', [
    'College of Computer Studies',
    'College of Accountancy',
    'College of Criminal Justice Education',
    'College of Teacher Education',
    'College of Arts and Sciences',
    'School of Graduate Studies',
]); 

export const courseEnum = pgEnum('course_enum', [
    'Bachelor of Science in Information Technology',
    'Bachelor of Science in Accountancy',
    'Bachelor of Science in Business Administration',
    'Bachelor of Science in Journalism',
    'Bachelor of Science in Criminology',
    'Bachelor of Science in Psychology',
    'Bachelor in Elementary Education',
    'Bachelor in Secondary Education',
    'Master of Science in Information Technology',
    'Master of Science in Accountancy',
    'Master of Science in Business Administration'
]);

export const student_typeEnum = pgEnum('student_type', [
    'regular',
    'irregular'
]);