import { and, eq, ilike, ne, or } from 'drizzle-orm';
import { db } from '../../db/client';
import { programChairs } from '../../db/Program_Chair';
import { courses } from '../../db/Course';
import { persons } from '../../db/Person';
import { AppError } from '../../middleware/app-error';
import { checkUserExists, hashPassword } from '../common.utils';
import { ProgramChair, ProgramChairFilter } from './programChair.type';

export const createProgramChair = async (programChairData: ProgramChair) => {
    try {
        if (await checkUserExists(programChairData.personalData.email)) {
            throw new AppError('User with this email already exists', 400);
        }

        const generatedPassword = `${programChairData.personalData.lastName.toLowerCase()}${new Date().getFullYear()}`;
        const hashedPassword = await hashPassword(generatedPassword);

        const result = await db.transaction(async (tx) => {
            const checkEmailExists = await tx.select().from(persons).where(eq(persons.email, programChairData.personalData.email));
            if (checkEmailExists.length > 0) {
                throw new AppError('User with this email already exists', 400);
            }

            const [person] = await tx.insert(persons).values({
                firstName: programChairData.personalData.firstName,
                lastName: programChairData.personalData.lastName,
                middleName: programChairData.personalData.middleName,
                birthDate: programChairData.personalData.birthDate,
                contactNumber: programChairData.personalData.contactNumber,
                email: programChairData.personalData.email,
                password: hashedPassword,
                houseNumber: programChairData.personalData.address.houseNumber,
                street: programChairData.personalData.address.street,
                barangay: programChairData.personalData.address.barangay,
                cityMunicipality: programChairData.personalData.address.cityMunicipality,
                region: programChairData.personalData.address.region,
                province: programChairData.personalData.address.province,
                role: 6,
            }).returning({ id: persons.personId, username: persons.username });

            await tx.insert(programChairs).values({
                personId: person.id,
                courseId: programChairData.programChairData.courseId,
                startDate: programChairData.programChairData.startDate,
                status: programChairData.programChairData.status,
                type: programChairData.programChairData.type,
            });

            return person;
        });

        return {
            username: result.username,
            password: generatedPassword,
        };
    } catch (error) {
        throw error;
    }
};

export const listProgramChairs = async (page: number, limit: number, filter: ProgramChairFilter = {}) => {
    try {
        const programChairWhereClause: any[] = [];
        if (filter.courseId) programChairWhereClause.push(eq(programChairs.courseId, filter.courseId));
        if (filter.startDate) programChairWhereClause.push(ilike(programChairs.startDate, `%${filter.startDate}%`));
        if (filter.status) programChairWhereClause.push(eq(programChairs.status, filter.status));
        if (filter.type) programChairWhereClause.push(eq(programChairs.type, filter.type));

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

        const result = await db.query.programChairs.findMany({
            where: and(...programChairWhereClause),
            with: {
                person: {
                    where: or(...personWhereClause),
                    columns: {
                        password: false
                    },
                },
                course: true,
            },
            offset: (page - 1) * limit,
            limit,
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const getProgramChairById = async (programChairId: number) => {
    try {
        const result = await db.query.programChairs.findFirst({
            where: eq(programChairs.programChairId, programChairId),
            with: {
                person: {
                    columns: {
                        password: false
                    }
                },
                course: true,
            }
        });
        return result || null;
    } catch (error) {
        throw error;
    }
};

export const updateProgramChair = async (programChairId: number, programChairData: Partial<ProgramChair>) => {
    try {
        const result = await db.transaction(async (tx) => {
            const existingProgramChair = await tx.query.programChairs.findFirst({
                where: eq(programChairs.programChairId, programChairId),
                with: {
                    person: { columns: { email: true } },
                },
            });

            if (!existingProgramChair) {
                throw new AppError('Program chair not found', 404);
            }

            const emailToCheck = programChairData.personalData?.email ?? existingProgramChair.person.email;

            const checkEmailExists = await tx.query.persons.findFirst({
                where: and(
                    eq(persons.email, emailToCheck),
                    ne(persons.personId, existingProgramChair.personId)
                ),
            });

            if (checkEmailExists) {
                throw new AppError('User with this email already exists', 400);
            }

            const [updatedProgramChair] = await tx.update(programChairs)
                .set({
                    courseId: programChairData.programChairData?.courseId,
                    startDate: programChairData.programChairData?.startDate,
                    status: programChairData.programChairData?.status,
                    type: programChairData.programChairData?.type,
                })
                .where(eq(programChairs.programChairId, programChairId))
                .returning({
                    courseId: programChairs.courseId,
                    startDate: programChairs.startDate,
                    status: programChairs.status,
                    type: programChairs.type,
                    personId: programChairs.personId,
                });

            const [updatedPerson] = await tx.update(persons)
                .set({
                    firstName: programChairData.personalData?.firstName,
                    lastName: programChairData.personalData?.lastName,
                    middleName: programChairData.personalData?.middleName,
                    birthDate: programChairData.personalData?.birthDate,
                    email: programChairData.personalData?.email,
                    contactNumber: programChairData.personalData?.contactNumber,
                    street: programChairData.personalData?.address?.street,
                    barangay: programChairData.personalData?.address?.barangay,
                    cityMunicipality: programChairData.personalData?.address?.cityMunicipality,
                    region: programChairData.personalData?.address?.region,
                    province: programChairData.personalData?.address?.province,
                })
                .where(eq(persons.personId, updatedProgramChair.personId))
                .returning({
                    firstName: persons.firstName,
                    lastName: persons.lastName,
                    middleName: persons.middleName,
                    birthDate: persons.birthDate,
                    email: persons.email,
                    contactNumber: persons.contactNumber,
                    houseNumber: persons.houseNumber,
                    street: persons.street,
                    barangay: persons.barangay,
                    cityMunicipality: persons.cityMunicipality,
                    region: persons.region,
                    province: persons.province,
                });

            return {
                person: updatedPerson,
                programChair: updatedProgramChair,
            };
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const deleteProgramChair = async (programChairId: number) => {
    try {
        const result = await db.delete(programChairs).where(eq(programChairs.programChairId, programChairId)).returning();
        return result[0] || null;
    } catch (error) {
        throw error;
    }
};