CREATE TYPE "public"."StatusEnum" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."student_type" AS ENUM('regular', 'irregular');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" integer PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"office" varchar(255) NOT NULL,
	"hire_date" date NOT NULL,
	"status" "StatusEnum" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"department_id" integer NOT NULL,
	CONSTRAINT "courses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "deans" (
	"id" integer PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"start_date" date NOT NULL,
	"department_id" integer NOT NULL,
	"status" "StatusEnum" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "departments_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "directors" (
	"id" integer PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"office_id" integer NOT NULL,
	"hire_date" date NOT NULL,
	"status" varchar(255) DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faculty" (
	"id" integer PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"hire_date" date NOT NULL,
	"status" "StatusEnum" DEFAULT 'active' NOT NULL,
	"department_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offices" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "offices_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "persons" (
	"id" integer PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"middle_name" varchar(255),
	"birth_date" date NOT NULL,
	"contact_number" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"house_number" varchar(255) NOT NULL,
	"street" varchar(255) NOT NULL,
	"barangay" varchar(255) NOT NULL,
	"city_municipality" varchar(255) NOT NULL,
	"region" varchar(255) NOT NULL,
	CONSTRAINT "persons_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "program_chairs" (
	"id" integer PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"start_date" date NOT NULL,
	"status" "StatusEnum" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" integer PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"office_id" integer NOT NULL,
	"hire_date" date NOT NULL,
	"status" "StatusEnum" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" integer PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"enrollment_date" date NOT NULL,
	"department_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"status" "StatusEnum" DEFAULT 'active' NOT NULL,
	"section" varchar(50) NOT NULL,
	"student_type" "student_type" DEFAULT 'regular' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deans" ADD CONSTRAINT "deans_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deans" ADD CONSTRAINT "deans_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directors" ADD CONSTRAINT "directors_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directors" ADD CONSTRAINT "directors_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_chairs" ADD CONSTRAINT "program_chairs_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_chairs" ADD CONSTRAINT "program_chairs_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;