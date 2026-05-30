CREATE TYPE "public"."personRole" AS ENUM('student', 'faculty', 'admin', 'dean', 'programChair', 'staff');--> statement-breakpoint
ALTER TABLE "persons" ADD COLUMN "role" "personRole" NOT NULL;