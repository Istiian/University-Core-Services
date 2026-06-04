// import { Status, studentType } from "./Person/person.enum";



type studentStatus = "active" | "graduated" | "dropped" | "suspended";
type studentType = "regular" | "irregular";

type employeeStatus = "active" | "suspended" | "terminated" | "retired" | "resigned";
type employeeType = "Full-time" | "Part-time" | "Contractual";

type personRole = "student" | "faculty" | "admin" | "dean" | "programChair" | "staff";

type address = {
    houseNumber: string;
    street: string;
    barangay: string;
    cityMunicipality: string;
    region: string;
    province: string;
};
export interface Person {
    personId: number;
    firstName: string;
    lastName: string;
    middleName: string | null;
    birthDate: string;
    contactNumber: string;
    email: string;
    password: string;
    repeatPassword: string;
    address: address;
    role: personRole;
}

export interface updatePersonData {
    studentId: number;
    firstName?: string;
    lastName?: string;
    middleName?: string | null;
    birthDate?: string;
    contactNumber?: string;
    email?: string;
    address?: Partial<address>;
}
export interface CollegeDepartment{
    id: number;
    name: string;
}

export interface Course {
    id: number;
    name: string;
    departmentId: number;
}

export interface Staff {
    id: number;
    personId: number;
    officeId: number;
    startDate: string;
    status?: employeeStatus;
    type: employeeType;
}

export interface Student{
    personId: number;
    enrollmentDate: string;
    courseId: number;
    status?: studentStatus;
    section: string;
    studentType: studentType;
}

export interface Admin {
    personId: number;
    officeId: number;
    startDate: string;
    status: employeeStatus;
    type: employeeType;
}

export interface Faculty {
    personId: number;
    startDate: string;
    status: employeeStatus;
    type: employeeType;
    departmentId: number;
}

export interface Dean {
    personId: number;
    startDate: string;
    departmentId: number;
    status: employeeStatus;
    type: employeeType;
}

export interface ProgramChair {
    personId: number;
    courseId?: number;
    startDate: string;
    status: employeeStatus;
    type: employeeType;
}
