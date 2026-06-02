import { Person } from '../common.type';

export type employeeStatus = 'active' | 'suspended' | 'terminated' | 'retired' | 'resigned';
export type employeeType = 'Full-time' | 'Part-time' | 'Contractual';

export interface AdminInfo {
    adminId?: number;
    officeId: number;
    startDate: string;
    status?: employeeStatus;
    type: employeeType;
}

export interface Admin {
    personalData: Person;
    adminData: AdminInfo;
}

export type AdminFilter = {
    adminId?: number;
    personId?: number;
    officeId?: number;
    startDate?: string;
    status?: employeeStatus;
    type?: employeeType;
    search?: string;
};