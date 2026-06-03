import { db } from '../../db/client';
import { staff } from '../../db/Staff';
import { and, eq, ilike, ne, or } from 'drizzle-orm';
import { Staff, StaffFilter } from './staff.type';
import { Person } from '../common.type';
import { persons } from '../../db/Person';
import { hashPassword } from '../common.utils';
import { checkUserExists } from '../common.utils';
import { AppError } from '../../middleware/app-error';

export const createStaff = async (staffData: Staff) => {
    try {
        if (await checkUserExists(staffData.personalData.email)) {

            throw new AppError("User with this email already exists", 400);
        }

        const generatedPassword = `${staffData.personalData.lastName.toLowerCase()}${new Date().getFullYear()}`;
        const hashedPassword = await hashPassword(generatedPassword);

        const result = await db.transaction(async (tx) => {
            const checkEmailExists = await tx.select().from(persons).where(eq(persons.email, staffData.personalData.email));
            if (checkEmailExists) {
                throw new AppError("User with this email already exists", 400);
            }
            const [person] = await tx.insert(persons).values({
                firstName: staffData.personalData.firstName,
                lastName: staffData.personalData.lastName,
                middleName: staffData.personalData.middleName,
                birthDate: staffData.personalData.birthDate,
                contactNumber: staffData.personalData.contactNumber,
                email: staffData.personalData.email,
                password: hashedPassword,
                houseNumber: staffData.personalData.address.houseNumber,
                street: staffData.personalData.address.street,
                barangay: staffData.personalData.address.barangay,
                cityMunicipality: staffData.personalData.address.cityMunicipality,
                region: staffData.personalData.address.region,
                province: staffData.personalData.address.province,
                role: "staff"
            }).returning({ id: persons.personId, username: persons.username });

            const newStaff = await tx.insert(staff).values({
                personId: person.id,
                officeId: staffData.staffData.officeId,
                startDate: staffData.staffData.startDate,
                status: staffData.staffData.status,
                type: staffData.staffData.type,
            })
            return person
        });

        return {
            username: result.username,
            password: generatedPassword
        };
    } catch (error) {
        throw error
    }
}

export const getStaff = async (page: number, limit: number, filter: StaffFilter = {}) => {
    try {
        const staffWhereClause: any = [];
        if (filter.staffId) staffWhereClause.push(eq(staff.staffId, filter.staffId));
        if (filter.personId) staffWhereClause.push(eq(staff.personId, filter.personId));
        if (filter.officeId) staffWhereClause.push(eq(staff.officeId, filter.officeId));
        if (filter.startDate) staffWhereClause.push(ilike(staff.startDate, `%${filter.startDate}%`));
        if (filter.status) staffWhereClause.push(eq(staff.status, filter.status));
        if (filter.type) staffWhereClause.push(eq(staff.type, filter.type));

        const personWhereClause: any = [];
        if (filter.search) {
            const searchTerm = `%${filter.search}%`;
            personWhereClause.push(or(
                ilike(persons.firstName, searchTerm),
                ilike(persons.lastName, searchTerm),
                ilike(persons.email, searchTerm),
                ilike(persons.contactNumber, searchTerm)
            ));
        }

        const result = await db.query.staff.findMany({
            where: and(...staffWhereClause),
            with: {
                person: {
                    where: or(...personWhereClause),
                    columns: {
                        password: false
                    }
                },
                office: true,
            },
            offset: (page - 1) * limit,
            limit: limit
        });

        return result;
    } catch (error) {
        throw error
    }
}

export const updateStaff = async (staffId: number, staffData: Partial<Staff>) => {
    try {

        const result = await db.transaction(async (tx) => {
            const existingStaff = await tx.query.staff.findFirst({
                where: eq(staff.staffId, staffId),
                with: {
                    person: { columns: { email: true } },
                }
            });

            if (!existingStaff) {
                throw new AppError('Staff not found', 404);
            }

            const emailToCheck = staffData.personalData?.email ?? existingStaff.person.email;

            const checkEmailExists = await tx.query.persons.findFirst({
                where: and(
                    eq(persons.email, emailToCheck),
                    ne(persons.personId, existingStaff.personId)
                )
            });
            console.log("checkEmailExists", checkEmailExists);

            if (checkEmailExists) {
                throw new AppError("User with this email already exists", 400);
            }


            const [updatedStaff] = await tx.update(staff)
                .set({
                    officeId: staffData.staffData?.officeId,
                    startDate: staffData.staffData?.startDate,
                    status: staffData.staffData?.status,
                    type: staffData.staffData?.type
                })
                .where(eq(staff.staffId, staffId)).returning();


            const [updatedPerson] = await tx.update(persons)
                .set({
                    firstName: staffData.personalData?.firstName,
                    lastName: staffData.personalData?.lastName,
                    middleName: staffData.personalData?.middleName,
                    birthDate: staffData.personalData?.birthDate,
                    email: staffData.personalData?.email,
                    contactNumber: staffData.personalData?.contactNumber,
                    street: staffData.personalData?.address?.street,
                    barangay: staffData.personalData?.address?.barangay,
                    cityMunicipality: staffData.personalData?.address?.cityMunicipality,
                    region: staffData.personalData?.address?.region,
                    province: staffData.personalData?.address?.province
                })
                .where(eq(persons.personId, updatedStaff.personId)).returning();

            return {
                person: updatedPerson,
                staff: updatedStaff
            };
        });

        return result;
    } catch (error) {
        throw error
    }
}

export const deleteStaff = async (staffId: number) => {
    try {
        const result = await db.delete(staff).where(eq(staff.staffId, staffId)).returning();
        return result[0] || null;
    } catch (error) {
        throw error
    }
}
