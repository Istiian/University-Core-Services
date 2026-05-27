// import { Status, studentType } from "./Person/person.enum";



type studentStatus = "active" | "graduated" | "dropped" | "suspended";
type studentType = "regular" | "irregular";

type employeeStatus = "active" | "suspended" | "terminated" | "retired" | "resigned";
type employeeType = "Full-time" | "Part-time" | "Contractual";


export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string | null;
    birthDate: string;
    contactNumber: string;
    email: string;
    password: string;
    houseNumber: string;
    street: string;
    barangay: string;
    cityMunicipality: string;
    region: string;
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
    hireDate: string;
    status: Status;
}

export interface Student extends Person {
    personId: number;
    enrollmentDate: string;
    departmentId: number;
    course: Course;
    status: Status;
    section: string;
    studentType: studentType;
}

export interface Admin extends Person {
    personId: number;
    officeId: number;
    hireDate: string;
    status: Status;
}

export interface Faculty extends Person {
    personId: number;
    hireDate: string;
    status: Status;
    departmentId: number;
}

export interface Dean extends Person {
    personId: number;
    startDate: string;
    departmentId: number;
    status: DeanStatus;
}

export interface ProgramChair {
    id: number;
    personId: number;
    courseId: number;
    startDate: string;
    status: Status;
}

export interface Director {
    id: number;
    personId: number;
    officeId: number;
    hireDate: string;
    status: string;
}

