import { and, eq, ilike, ne, or } from 'drizzle-orm';
import { db } from '../../db/client';
import { admins } from '../../db/Admin';
import { offices } from '../../db/Office';
import { persons } from '../../db/Person';
import { AppError } from '../../middleware/app-error';
import { checkUserExists, hashPassword } from '../common.utils';
import { Admin, AdminFilter } from './admin.type';
import { ROLE_ID } from '../../constants/roles';

export const createAdmin = async (adminData: Admin) => {
    try {
        if (await checkUserExists(adminData.personalData.email)) {
            throw new AppError('User with this email already exists', 400);
        }

        const generatedPassword = `${adminData.personalData.lastName.toLowerCase()}${new Date().getFullYear()}`;
        const hashedPassword = await hashPassword(generatedPassword);

        const result = await db.transaction(async (tx) => {
            const checkEmailExists = await tx.select().from(persons).where(eq(persons.email, adminData.personalData.email));
            if (checkEmailExists.length > 0) {
                throw new AppError('User with this email already exists', 400);
            }

            const [person] = await tx.insert(persons).values({
                firstName: adminData.personalData.firstName,
                lastName: adminData.personalData.lastName,
                middleName: adminData.personalData.middleName,
                birthDate: adminData.personalData.birthDate,
                contactNumber: adminData.personalData.contactNumber,
                email: adminData.personalData.email,
                password: hashedPassword,
                houseNumber: adminData.personalData.address.houseNumber,
                street: adminData.personalData.address.street,
                barangay: adminData.personalData.address.barangay,
                cityMunicipality: adminData.personalData.address.cityMunicipality,
                region: adminData.personalData.address.region,
                province: adminData.personalData.address.province,
                role: ROLE_ID.ADMIN,
            }).returning({ id: persons.personId, username: persons.username });

            await tx.insert(admins).values({
                personId: person.id,
                officeId: adminData.adminData.officeId,
                startDate: adminData.adminData.startDate,
                status: adminData.adminData.status,
                type: adminData.adminData.type,
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

export const listAdmins = async (page: number, limit: number, filter: AdminFilter = {}) => {
    try {
        const adminWhereClause: any[] = [];
        if (filter.officeId) adminWhereClause.push(eq(admins.officeId, filter.officeId));
        if (filter.startDate) adminWhereClause.push(ilike(admins.startDate, `%${filter.startDate}%`));
        if (filter.status) adminWhereClause.push(eq(admins.status, filter.status));
        if (filter.type) adminWhereClause.push(eq(admins.type, filter.type));

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

        const result = await db.query.admins.findMany({
            where: and(...adminWhereClause),
            with: {
                person: {
                    where: or(...personWhereClause),
                    columns: {
                        password: false
                    },
                },
                office: true,
            },
            offset: (page - 1) * limit,
            limit,
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const getAdminById = async (adminId: number) => {
    try {
        const result = await db.query.admins.findFirst({
            where: eq(admins.adminId, adminId),
            with: {
                person: {
                    columns: {
                        password: false
                    },
                },
                office: true,
            },
        });
        return result || null;
    } catch (error) {
        throw error;
    }
};

export const updateAdmin = async (adminId: number, adminData: Partial<Admin>) => {
    try {
        const result = await db.transaction(async (tx) => {
            const existingAdmin = await tx.query.admins.findFirst({
                where: eq(admins.adminId, adminId),
                with: {
                    person: { columns: { email: true } },
                },
            });

            if (!existingAdmin) {
                throw new AppError('Admin not found', 404);
            }

            const emailToCheck = adminData.personalData?.email ?? existingAdmin.person.email;

            const checkEmailExists = await tx.query.persons.findFirst({
                where: and(
                    eq(persons.email, emailToCheck),
                    ne(persons.personId, existingAdmin.personId)
                ),
            });

            if (checkEmailExists) {
                throw new AppError('User with this email already exists', 400);
            }

            const [updatedAdmin] = await tx.update(admins)
                .set({
                    officeId: adminData.adminData?.officeId,
                    startDate: adminData.adminData?.startDate,
                    status: adminData.adminData?.status,
                    type: adminData.adminData?.type,
                })
                .where(eq(admins.adminId, adminId))
                .returning({
                    officeId: admins.officeId,
                    startDate: admins.startDate,
                    status: admins.status,
                    type: admins.type,
                    personId: admins.personId,
                });

            const [updatedPerson] = await tx.update(persons)
                .set({
                    firstName: adminData.personalData?.firstName,
                    lastName: adminData.personalData?.lastName,
                    middleName: adminData.personalData?.middleName,
                    birthDate: adminData.personalData?.birthDate,
                    email: adminData.personalData?.email,
                    contactNumber: adminData.personalData?.contactNumber,
                    street: adminData.personalData?.address?.street,
                    barangay: adminData.personalData?.address?.barangay,
                    cityMunicipality: adminData.personalData?.address?.cityMunicipality,
                    region: adminData.personalData?.address?.region,
                    province: adminData.personalData?.address?.province,
                })
                .where(eq(persons.personId, updatedAdmin.personId))
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
                admin: updatedAdmin,
            };
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const deleteAdmin = async (adminId: number) => {
    try {
        const result = await db.delete(admins).where(eq(admins.adminId, adminId)).returning();
        return result[0] || null;
    } catch (error) {
        throw error;
    }
};