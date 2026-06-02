import { Person } from "../common.type";

export type employeeStatus = "active" | "suspended" | "terminated" | "retired" | "resigned";
export type employeeType = "Full-time" | "Part-time" | "Contractual";

export interface StaffInfo {
    staffId?: number;
    
    officeId: number;
    startDate: string;
    status?: employeeStatus;
    type: employeeType;
}

export interface Staff {
    personalData: Person;
    staffData: StaffInfo;
}

export type StaffFilter = {
    staffId?: number;
    personId?: number;
    officeId?: number;
    startDate?: string;
    status?: employeeStatus;
    type?: employeeType;
};
