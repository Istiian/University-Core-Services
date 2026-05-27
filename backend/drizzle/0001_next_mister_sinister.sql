CREATE TYPE "public"."EmployeeStatus" AS ENUM('active', 'suspended', 'terminated', 'retired', 'resigned');--> statement-breakpoint
CREATE TYPE "public"."EmployeeType" AS ENUM('Full-time', 'Part-time', 'Contractual');--> statement-breakpoint
CREATE TYPE "public"."StudentStatus" AS ENUM('active', 'graduated', 'dropped', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."StudentType" AS ENUM('regular', 'irregular');--> statement-breakpoint
ALTER TABLE "directors" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "directors" CASCADE;--> statement-breakpoint
ALTER TABLE "admins" RENAME COLUMN "hire_date" TO "start_date";--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_department_id_departments_id_fk";
--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "status" SET DATA TYPE "public"."EmployeeStatus" USING "status"::text::"public"."EmployeeStatus";--> statement-breakpoint
ALTER TABLE "admins" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "deans" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "deans" ALTER COLUMN "status" SET DATA TYPE "public"."EmployeeStatus" USING "status"::text::"public"."EmployeeStatus";--> statement-breakpoint
ALTER TABLE "deans" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "faculty" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "faculty" ALTER COLUMN "status" SET DATA TYPE "public"."EmployeeStatus" USING "status"::text::"public"."EmployeeStatus";--> statement-breakpoint
ALTER TABLE "faculty" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "program_chairs" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "program_chairs" ALTER COLUMN "status" SET DATA TYPE "public"."EmployeeStatus" USING "status"::text::"public"."EmployeeStatus";--> statement-breakpoint
ALTER TABLE "program_chairs" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "staff" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "staff" ALTER COLUMN "status" SET DATA TYPE "public"."EmployeeStatus" USING "status"::text::"public"."EmployeeStatus";--> statement-breakpoint
ALTER TABLE "staff" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "status" SET DATA TYPE "public"."StudentStatus" USING "status"::text::"public"."StudentStatus";--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "student_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "student_type" SET DATA TYPE "public"."StudentType" USING "student_type"::text::"public"."StudentType";--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "student_type" SET DEFAULT 'regular';--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "office_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "type" "EmployeeType" NOT NULL;--> statement-breakpoint
ALTER TABLE "deans" ADD COLUMN "type" "EmployeeType" NOT NULL;--> statement-breakpoint
ALTER TABLE "faculty" ADD COLUMN "type" "EmployeeType" NOT NULL;--> statement-breakpoint
ALTER TABLE "program_chairs" ADD COLUMN "type" "EmployeeType" NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "type" "EmployeeType" NOT NULL;--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admins" DROP COLUMN "office";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "department_id";--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_person_id_unique" UNIQUE("person_id");--> statement-breakpoint
ALTER TABLE "deans" ADD CONSTRAINT "deans_person_id_unique" UNIQUE("person_id");--> statement-breakpoint
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_person_id_unique" UNIQUE("person_id");--> statement-breakpoint
ALTER TABLE "program_chairs" ADD CONSTRAINT "program_chairs_person_id_unique" UNIQUE("person_id");--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_person_id_unique" UNIQUE("person_id");--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_person_id_unique" UNIQUE("person_id");--> statement-breakpoint
DROP TYPE "public"."StatusEnum";--> statement-breakpoint
DROP TYPE "public"."student_type";