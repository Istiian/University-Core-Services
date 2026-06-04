import { students } from "../../db/Student"
import { db } from "../../db/client";
import { persons } from "../../db/schema";
import { AppError } from "../../middleware/app-error";
import { checkUserExists, hashPassword } from "../common.utils";
import { Student, StudentFilter } from "./student.type";
import { and, eq, ilike, ne, or } from "drizzle-orm";
import { ROLE_ID } from "../../constants/roles";
import { handleServiceError } from "../../utils/serviceError";

export const getAllStudents = async (page: number, limit: number, filter: StudentFilter = {}) => {
    const offset = (page - 1) * limit;
    const studentWhereClause: any = []
    if (filter.status) studentWhereClause.push(eq(students.status, filter.status))
    if (filter.studentType) studentWhereClause.push(eq(students.studentType, filter.studentType))
    if (filter.courseId) studentWhereClause.push(eq(students.courseId, filter.courseId))
    
    const personWhereClause: any = []
    if (filter.search) {
        const searchTerm = `%${filter.search}%`;
        personWhereClause.push(or(
            ilike(persons.firstName, searchTerm),
            ilike(persons.lastName, searchTerm),
            ilike(persons.email, searchTerm),
            ilike(persons.username, searchTerm)
        ));
    }
    try {
        return await db.query.students.findMany({
            where: and(...studentWhereClause),
            with: {
                person: {
                    where: or(...personWhereClause),
                    columns: {
                        password: false
                    }
                },
                course: { columns: { name: true } }
            },
            limit,
            offset
        });

       
    } catch (error) {
        handleServiceError(error, 'getAllStudents', 'Failed to fetch students');
    }
};

export const getStudentById = async (studentId: number) => {
    try {
        const student = await db.query.students.findFirst({
            where: eq(students.studentId, studentId),
            with: {
                person: { columns: { password: false } },
                course: { columns: { name: true } }
            }
        });
        return student;
    } catch (error) {
        handleServiceError(error, 'getStudentById', 'Failed to fetch student');
    }
};

export const registerStudent = async (studentData: Student) => {
    try {
        const generatedPassword = `${studentData.personalData.lastName.toLowerCase()}${new Date().getFullYear()}`;
        const hashedPassword = await hashPassword(generatedPassword);

        if (await checkUserExists(studentData.personalData.email)) {
            throw new AppError("User with this email already exists", 400);
        }

        const data = await db.transaction(async (trx) => {
            const [person] = await trx.insert(persons).values({
                firstName: studentData.personalData.firstName,
                lastName: studentData.personalData.lastName,
                middleName: studentData.personalData.middleName,
                birthDate: studentData.personalData.birthDate,
                contactNumber: studentData.personalData.contactNumber,
                email: studentData.personalData.email,
                password: hashedPassword,
                houseNumber: studentData.personalData.address.houseNumber,
                street: studentData.personalData.address.street,
                barangay: studentData.personalData.address.barangay,
                cityMunicipality: studentData.personalData.address.cityMunicipality,
                region: studentData.personalData.address.region,
                province: studentData.personalData.address.province,
                role: ROLE_ID.STUDENT
            }).returning({ id: persons.personId, username: persons.username });

            const student = await trx.insert(students).values({
                personId: person.id,
                enrollmentDate: studentData.studentData.enrollmentDate,
                courseId: studentData.studentData.courseId,
                status: studentData.studentData.status,
                studentType: studentData.studentData.studentType
            })

            return { person };
        });

        return { ...data, password: generatedPassword };
    } catch (error) {
        handleServiceError(error, 'registerStudent', 'Failed to register student');
    }
}

export const updateStudentInfo = async (studentId: number, studentData: Partial<Student>, trx?: any) => {
    try {
        const result = await db.transaction(async (trx) => {
            const existingStudent = await trx.query.students.findFirst({
                where: eq(students.studentId, studentId),
                with: {
                    person: { columns: { email: true } }
                }
            });
            if (!existingStudent) {
                throw new AppError("Student not found", 404);
            }
            const emailToCheck = studentData.personalData?.email ?? existingStudent.person.email;
            const checkEmailExists = await trx.query.persons.findFirst({
                where: and(
                    eq(persons.email, emailToCheck),
                    ne(persons.personId, existingStudent.personId)
                )
            });
            if (checkEmailExists) {
                throw new AppError("User with this email already exists", 400);
            }

            await trx.update(persons)
                .set({
                    firstName: studentData.personalData?.firstName,
                    lastName: studentData.personalData?.lastName,
                    middleName: studentData.personalData?.middleName,
                    birthDate: studentData.personalData?.birthDate,
                    contactNumber: studentData.personalData?.contactNumber,
                    email: studentData.personalData?.email,
                    houseNumber: studentData.personalData?.address?.houseNumber,
                    street: studentData.personalData?.address?.street,
                    barangay: studentData.personalData?.address?.barangay,
                    cityMunicipality: studentData.personalData?.address?.cityMunicipality,
                    region: studentData.personalData?.address?.region,
                    province: studentData.personalData?.address?.province
                })
                .where(eq(persons.personId, existingStudent.personId))
                
            
            await trx.update(students)
                .set({
                    enrollmentDate: studentData.studentData?.enrollmentDate,
                    courseId: studentData.studentData?.courseId,
                    status: studentData.studentData?.status,
                    studentType: studentData.studentData?.studentType
                })
                .where(eq(students.personId, existingStudent.personId))
        });

    } catch (error) {
        handleServiceError(error, 'updateStudentInfo', 'Failed to update student');
    }
}

export const deleteStudentInfo = async (studentId: number, trx?: any) => {
    try {
        const personId = await db.query.students.findFirst({
            where: eq(students.studentId, studentId),
            columns: { personId: true }
        });

        if (!personId) {
            throw new AppError("Student not found", 404);
        }

        const deletedData = await db.transaction(async (trx) => {
            const deletedPerson = await trx.delete(persons)
                .where(eq(persons.personId, personId.personId))
                .returning();

            const deletedStudent = await trx.delete(students)
                .where(eq(students.personId, personId.personId))
                .returning();

            return { deletedPerson, deletedStudent };
        });

        return deletedData;
    } catch (error) {
        handleServiceError(error, 'deleteStudentInfo', 'Failed to delete student');
    }
}
