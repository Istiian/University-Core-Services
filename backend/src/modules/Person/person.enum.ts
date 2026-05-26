import {pgEnum } from "drizzle-orm/pg-core";

// export enum Department {
//     CCS = "College of Computer Studies",
//     COA = "College of Accountancy",
//     CCJE = "College of Criminal Justice Education",
//     CTE = "College of Teacher Education",
//     CAS = "College of Arts and Sciences",
//     SGS = "School of Graduate Studies"
// }

// export enum Course{
//     BSIT = "Bachelor of Science in Information Technology",
//     BSA = "Bachelor of Science in Accountancy",
//     BSBA = "Bachelor of Science in Business Administration",
//     BSJ = "Bachelor of Science in Journalism",
//     BSC = "Bachelor of Science in Criminology",
//     BSP = "Bachelor of Science in Psychology",
//     BEED = "Bachelor in Elementary Education",
//     BSED = "Bachelor in Secondary Education",
//     MSIT = "Master of Science in Information Technology",
//     MSA = "Master of Science in Accountancy",
//     MSBA = "Master of Science in Business Administration"
// }

// export enum Office {
//     Registrar = "Registrar",
//     Accounting = "Accounting",
//     HumanResources = "Human Resources",
//     ITSupport = "IT Support",
//     StudentAffairs = "Student Affairs",
//     FacultyAffairs = "Faculty Affairs",
//     ResearchAndDevelopment = "Research and Development",
//     LibraryServices = "Library Services",
//     FacilitiesManagement = "Facilities Management",
//     Security = "Security",
//     Finance = "Finance",
//     Admissions = "Admissions",
//     AlumniRelations = "Alumni Relations",
//     PublicRelations = "Public Relations",
//     LegalAffairs = "Legal Affairs",
//     AcademicAffairs = "Academic Affairs",
//     AdministrativeServices = "Administrative Services"
// }

export enum Status {
    Active = "active",
    Inactive = "inactive"
}

export enum studentType {
    Regular = "regular",
    Irregular = "irregular"
}
