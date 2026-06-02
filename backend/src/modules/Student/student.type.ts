import { Person } from "../common.type";
export type studentStatus = "active" | "graduated" | "dropped" | "suspended";
export type studentType = "regular" | "irregular";

export interface StudentInfo{
    personId?: number;
    enrollmentDate: string;
    courseId: number;
    status?: studentStatus;
    section: string;
    studentType: studentType;
}

export interface Student {
    personalData: Person;
    studentData: StudentInfo;
}

export type StudentFilter = {
    status?: studentStatus;
    role?: string;
    courseId?: number;
    section?: string;
    studentType?: studentType;
    search?: string;
    enrollmentDate?: string;
    // add other attributes as needed
};