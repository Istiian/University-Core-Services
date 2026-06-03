import { and, eq, ilike, ne, or } from 'drizzle-orm';
import { db } from '../../db/client';
import { deans } from '../../db/Dean';
import { persons } from '../../db/Person';
import { AppError } from '../../middleware/app-error';
import { checkUserExists, hashPassword } from '../common.utils';
import { Dean, DeanFilter } from './dean.type';

export const createDean = async (deanData: Dean) => {
    try {
        if (await checkUserExists(deanData.personalData.email)) {
            throw new AppError('User with this email already exists', 400);
        }

        const generatedPassword = `${deanData.personalData.lastName.toLowerCase()}${new Date().getFullYear()}`;
        const hashedPassword = await hashPassword(generatedPassword);

        const result = await db.transaction(async (tx) => {
            const checkEmailExists = await tx.select().from(persons).where(eq(persons.email, deanData.personalData.email));
            if (checkEmailExists.length > 0) {
                throw new AppError('User with this email already exists', 400);
            }

            const [person] = await tx.insert(persons).values({
                firstName: deanData.personalData.firstName,
                lastName: deanData.personalData.lastName,
                middleName: deanData.personalData.middleName,
                birthDate: deanData.personalData.birthDate,
                contactNumber: deanData.personalData.contactNumber,
                email: deanData.personalData.email,
                password: hashedPassword,
                houseNumber: deanData.personalData.address.houseNumber,
                street: deanData.personalData.address.street,
                barangay: deanData.personalData.address.barangay,
                cityMunicipality: deanData.personalData.address.cityMunicipality,
                region: deanData.personalData.address.region,
                province: deanData.personalData.address.province,
                role: 5,
            }).returning({ id: persons.personId, username: persons.username });

            await tx.insert(deans).values({
                personId: person.id,
                departmentId: deanData.deanData.departmentId,
                startDate: deanData.deanData.startDate,
                status: deanData.deanData.status,
                type: deanData.deanData.type,
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

export const listDeans = async (page: number, limit: number, filter: DeanFilter = {}) => {
    try {
        const deanWhereClause: any[] = [];
        if (filter.departmentId) deanWhereClause.push(eq(deans.departmentId, filter.departmentId));
        if (filter.startDate) deanWhereClause.push(ilike(deans.startDate, `%${filter.startDate}%`));
        if (filter.status) deanWhereClause.push(eq(deans.status, filter.status));
        if (filter.type) deanWhereClause.push(eq(deans.type, filter.type));

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

        const result = await db.query.deans.findMany({
            where: and(...deanWhereClause),
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

export const getDeanById = async (deanId: number) => {
    try {
        const result = await db.query.deans.findFirst({
            where: eq(deans.deanId, deanId),
            with: {
                person: {
                    columns: {
                        password: false
                    },
                },
                department: true,
            },
        });
        return result || null;
    } catch (error) {
        throw error;
    }
};

export const updateDean = async (deanId: number, deanData: Partial<Dean>) => {
    try {
        const result = await db.transaction(async (tx) => {
            const existingDean = await tx.query.deans.findFirst({
                where: eq(deans.deanId, deanId),
                with: {
                    person: { columns: { email: true } },
                },
            });

            if (!existingDean) {
                throw new AppError('Dean not found', 404);
            }

            const emailToCheck = deanData.personalData?.email ?? existingDean.person.email;

            const checkEmailExists = await tx.query.persons.findFirst({
                where: and(
                    eq(persons.email, emailToCheck),
                    ne(persons.personId, existingDean.personId)
                ),
            });

            if (checkEmailExists) {
                throw new AppError('User with this email already exists', 400);
            }

            const [updatedDean] = await tx.update(deans)
                .set({
                    departmentId: deanData.deanData?.departmentId,
                    startDate: deanData.deanData?.startDate,
                    status: deanData.deanData?.status,
                    type: deanData.deanData?.type,
                })
                .where(eq(deans.deanId, deanId))
                .returning({
                    departmentId: deans.departmentId,
                    startDate: deans.startDate,
                    status: deans.status,
                    type: deans.type,
                    personId: deans.personId,
                });

            const [updatedPerson] = await tx.update(persons)
                .set({
                    firstName: deanData.personalData?.firstName,
                    lastName: deanData.personalData?.lastName,
                    middleName: deanData.personalData?.middleName,
                    birthDate: deanData.personalData?.birthDate,
                    email: deanData.personalData?.email,
                    contactNumber: deanData.personalData?.contactNumber,
                    street: deanData.personalData?.address?.street,
                    barangay: deanData.personalData?.address?.barangay,
                    cityMunicipality: deanData.personalData?.address?.cityMunicipality,
                    region: deanData.personalData?.address?.region,
                    province: deanData.personalData?.address?.province,
                })
                .where(eq(persons.personId, updatedDean.personId))
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
                dean: updatedDean,
            };
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const deleteDean = async (deanId: number) => {
    try {
        const result = await db.delete(deans).where(eq(deans.deanId, deanId)).returning();
        return result[0] || null;
    } catch (error) {
        throw error;
    }
};