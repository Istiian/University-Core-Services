import { Person } from '../common.type';

export type employeeStatus = 'active' | 'suspended' | 'terminated' | 'retired' | 'resigned';
export type employeeType = 'Full-time' | 'Part-time' | 'Contractual';

export interface FacultyInfo {
    facultyId?: number;
    departmentId: number;
    startDate: string;
    status?: employeeStatus;
    type: employeeType;
}

export interface Faculty {
    personalData: Person;
    facultyData: FacultyInfo;
}

export type FacultyFilter = {
    facultyId?: number;
    personId?: number;
    departmentId?: number;
    startDate?: string;
    status?: employeeStatus;
    type?: employeeType;
    search?: string;
};
