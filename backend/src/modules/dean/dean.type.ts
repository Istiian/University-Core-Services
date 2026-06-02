import { Person } from '../common.type';

export type employeeStatus = 'active' | 'suspended' | 'terminated' | 'retired' | 'resigned';
export type employeeType = 'Full-time' | 'Part-time' | 'Contractual';

export interface DeanInfo {
    deanId?: number;
    departmentId: number;
    startDate: string;
    status?: employeeStatus;
    type: employeeType;
}

export interface Dean {
    personalData: Person;
    deanData: DeanInfo;
}

export type DeanFilter = {
    deanId?: number;
    personId?: number;
    departmentId?: number;
    startDate?: string;
    status?: employeeStatus;
    type?: employeeType;
    search?: string;
};