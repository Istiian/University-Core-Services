import { and, eq, ilike, ne, or } from 'drizzle-orm';
import { db } from '../../db/client';
import { faculty } from '../../db/Faculty';
import { persons } from '../../db/Person';
import { departments } from '../../db/Department';
import { AppError } from '../../middleware/app-error';
import { checkUserExists, hashPassword } from '../common.utils';
import { Faculty, FacultyFilter } from './faculty.type';
import { ROLE_ID } from '../../constants/roles';

export const createFaculty = async (facultyData: Faculty) => {
    try {
        if (await checkUserExists(facultyData.personalData.email)) {
            throw new AppError('User with this email already exists', 400);
        }

        const generatedPassword = `${facultyData.personalData.lastName.toLowerCase()}${new Date().getFullYear()}`;
        const hashedPassword = await hashPassword(generatedPassword);

        const result = await db.transaction(async (tx) => {
            const checkEmailExists = await tx.select().from(persons).where(eq(persons.email, facultyData.personalData.email));
            if (checkEmailExists.length > 0) {
                throw new AppError('User with this email already exists', 400);
            }

            const [person] = await tx.insert(persons).values({
                firstName: facultyData.personalData.firstName,
                lastName: facultyData.personalData.lastName,
                middleName: facultyData.personalData.middleName,
                birthDate: facultyData.personalData.birthDate,
                contactNumber: facultyData.personalData.contactNumber,
                email: facultyData.personalData.email,
                password: hashedPassword,
                houseNumber: facultyData.personalData.address.houseNumber,
                street: facultyData.personalData.address.street,
                barangay: facultyData.personalData.address.barangay,
                cityMunicipality: facultyData.personalData.address.cityMunicipality,
                region: facultyData.personalData.address.region,
                province: facultyData.personalData.address.province,
                role: ROLE_ID.FACULTY
            }).returning({ id: persons.personId, username: persons.username });

            await tx.insert(faculty).values({
                personId: person.id,
                departmentId: facultyData.facultyData.departmentId,
                startDate: facultyData.facultyData.startDate,
                status: facultyData.facultyData.status,
                type: facultyData.facultyData.type,
            });

            return person;
        });

        return {
            username: result.username,
            password: generatedPassword
        };
    } catch (error) {
        throw error;
    }
};

export const listFaculties = async (page: number, limit: number, filter: FacultyFilter = {}) => {
    try {
        const facultyWhereClause: any[] = [];
        if (filter.departmentId) facultyWhereClause.push(eq(faculty.departmentId, filter.departmentId));
        if (filter.startDate) facultyWhereClause.push(ilike(faculty.startDate, `%${filter.startDate}%`));
        if (filter.status) facultyWhereClause.push(eq(faculty.status, filter.status));
        if (filter.type) facultyWhereClause.push(eq(faculty.type, filter.type));

        const personWhereClause: any[] = [];
        if (filter.search) {
            const searchTerm = `%${filter.search}%`;
            personWhereClause.push(or(
                ilike(persons.firstName, searchTerm),
                ilike(persons.lastName, searchTerm),
                ilike(persons.email, searchTerm),
                ilike(persons.contactNumber, searchTerm)
            ));
        }

        const result = await db.query.faculty.findMany({
            where: and(...facultyWhereClause),
            with: {
                person: {
                    where: or(...personWhereClause),
                    columns: {
                        password: false
                    },
                },
                department: true,
            },
            offset: (page - 1) * limit,
            limit,
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const getFacultyById = async (facultyId: number) =>{
    try {
        const result = await db.query.faculty.findFirst({
            where: eq(faculty.facultyId, facultyId),
            with: {
                person: {
                    columns: {
                        password: false
                    }
                },
                department: true,
            },
        });
        return result;
    } catch (error) {
        throw error;
    }
}

export const updateFaculty = async (facultyId: number, facultyData: Partial<Faculty>) => {
    try {
        const result = await db.transaction(async (tx) => {
            const existingFaculty = await tx.query.faculty.findFirst({
                where: eq(faculty.facultyId, facultyId),
                with: {
                    person: { columns: { email: true } },
                },
            });

            if (!existingFaculty) {
                throw new AppError('Faculty not found', 404);
            }

            const emailToCheck = facultyData.personalData?.email ?? existingFaculty.person.email;

            const checkEmailExists = await tx.query.persons.findFirst({
                where: and(
                    eq(persons.email, emailToCheck),
                    ne(persons.personId, existingFaculty.personId)
                ),
            });

            if (checkEmailExists) {
                throw new AppError('User with this email already exists', 400);
            }

            const [updatedFaculty] = await tx.update(faculty)
                .set({
                    departmentId: facultyData.facultyData?.departmentId,
                    startDate: facultyData.facultyData?.startDate,
                    status: facultyData.facultyData?.status,
                    type: facultyData.facultyData?.type,
                })
                .where(eq(faculty.facultyId, facultyId))
                .returning({ id: faculty.facultyId, personId: faculty.personId });

            const updatedPerson = await tx.update(persons)
                .set({
                    firstName: facultyData.personalData?.firstName,
                    lastName: facultyData.personalData?.lastName,
                    middleName: facultyData.personalData?.middleName,
                    birthDate: facultyData.personalData?.birthDate,
                    email: facultyData.personalData?.email,
                    contactNumber: facultyData.personalData?.contactNumber,
                    street: facultyData.personalData?.address?.street,
                    barangay: facultyData.personalData?.address?.barangay,
                    cityMunicipality: facultyData.personalData?.address?.cityMunicipality,
                    region: facultyData.personalData?.address?.region,
                    province: facultyData.personalData?.address?.province,
                })
                .where(eq(persons.personId, updatedFaculty.personId))

        });

    } catch (error) {
        throw error;
    }
};

export const deleteFaculty = async (facultyId: number) => {
    try {
        const result = await db.delete(faculty).where(eq(faculty.facultyId, facultyId)).returning();
        return result[0] || null;
    } catch (error) {
        throw error;
    }
};
