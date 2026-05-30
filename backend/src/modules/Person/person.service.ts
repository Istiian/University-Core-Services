import { persons } from "../../db/Person";
import { students } from "../../db/Student";
import { staff } from "../../db/Staff";
import { Person, Student, Staff, Admin, Faculty, Dean, ProgramChair,  } from "../common.type";
import type { NodePgTransaction } from 'drizzle-orm/node-postgres';
import { admins } from "../../db/Admin";
import { faculty as facultyTable } from "../../db/Faculty";
import { deans } from "../../db/Dean";
import { programChairs } from "../../db/Program_Chair";
import { hashPassword, checkUserExists } from "./person.utils";
import { AppError } from "../../middleware/app-error";



export const recordPersonalInfo = async (personData: Person, trx?: any) => {
    try {
        if (await checkUserExists(personData.email)) {
            throw new AppError("Email already exists", 409);
        }

        if (personData.password !== personData.repeatPassword) {
            throw new AppError("Passwords do not match", 409);
        }
        
        const hashedPassword = await hashPassword(personData.password);
        
        const [person] = await trx.insert(persons).values({
            firstName: personData.firstName,
            lastName: personData.lastName,
            middleName: personData.middleName,
            birthDate: personData.birthDate,
            contactNumber: personData.contactNumber,
            email: personData.email,
            password: hashedPassword,
            houseNumber: personData.address.houseNumber,
            street: personData.address.street,
            barangay: personData.address.barangay,
            cityMunicipality: personData.address.cityMunicipality,
            region: personData.address.region,
            province: personData.address.province,
            role: personData.role
        }).returning();

        return person;

    } catch (error) {
        console.error("Error recording person info:", error);
        throw error;
    }
}

export const recordStudentInfo = async (studentData: Student, trx?: any) => {
    try{
        const [student] = await trx.insert(students).values({
            personId: studentData.personId,
            enrollmentDate: studentData.enrollmentDate,
            courseId: studentData.courseId,
            status: studentData.status,
            section: studentData.section,
            studentType: studentData.studentType
        }).returning();

        return student;
    } catch (error) {
        console.error("Error recording student info:", error);
        throw error;
    }
}

export const recordStaffInfo = async (staffData: Staff, trx?: any) => {
    try{
        const [staffMember] = await trx.insert(staff).values({
            personId: staffData.personId,
            officeId: staffData.officeId,
            startDate: staffData.startDate,
            status: staffData.status,
            type: staffData.type
        }).returning();

        return staffMember;
    } catch (error) {
        console.error("Error recording staff info:", error);
        throw error;
    }
}

export const recordAdminInfo = async (adminData: Admin, trx?: any) => {
    try{
        const [admin] = await trx.insert(admins).values({
            personId: adminData.personId,
            officeId: adminData.officeId,
            startDate: adminData.startDate,
            status: adminData.status,
            type: adminData.type
        }).returning();
    
        return admin;
    } catch (error) {
        console.error("Error recording admin info:", error);
        throw error;
    }
}

export const recordFacultyInfo = async (facultyData: Faculty, trx?: any) => {
    try{
        const [facultyMember] = await trx.insert(facultyTable).values({
            personId: facultyData.personId,
            startDate: facultyData.startDate,
            status: facultyData.status,
            type: facultyData.type,
            departmentId: facultyData.departmentId
        }).returning();

        return facultyMember;
    } catch (error) {
        console.error("Error recording faculty info:", error);
        throw error;
    }
}

export const recordDeanInfo = async (deanData: Dean, trx?: any) => {
    try{
        const [dean] = await trx.insert(deans).values({
            personId: deanData.personId,
            startDate: deanData.startDate,
            status: deanData.status,
            type: deanData.type,
            departmentId: deanData.departmentId
        }).returning();

        return dean;
    } catch (error) {
        console.error("Error recording dean info:", error);
        throw error;
    }
}

export const recordProgramChairInfo = async (programChairData: ProgramChair, trx?: any) => {
    try{
        const [programChair] = await trx.insert(programChairs).values({
            personId: programChairData.personId,
            courseId: programChairData.courseId,
            startDate: programChairData.startDate,
            status: programChairData.status,
            type: programChairData.type
        }).returning()
    
        return programChair;
    } catch (error) {
        console.error("Error recording program chair info:", error);
        throw error;
    }
}