/** Role IDs — must match drizzle/0012_rainy_marvel_apes.sql personRole migration */
export const ROLE_ID = {
    STUDENT: 2,
    FACULTY: 3,
    ADMIN: 1,
    DEAN: 5,
    PROGRAM_CHAIR: 6,
    STAFF: 4,
} as const;

export type RoleId = (typeof ROLE_ID)[keyof typeof ROLE_ID];
