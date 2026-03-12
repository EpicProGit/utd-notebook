CREATE TYPE "public"."student_classification" AS ENUM('Student', 'Graduate Student', 'Alum', 'Prospective Student', 'Faculty', 'Staff');--> statement-breakpoint
ALTER TABLE "user_metadata" ADD COLUMN "student_classification" "student_classification" DEFAULT 'Student' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_metadata" ADD COLUMN "graduation_date" date;--> statement-breakpoint
ALTER TABLE "user_metadata" ADD COLUMN "contact_email" text;--> statement-breakpoint
ALTER TABLE "user_metadata" DROP COLUMN "year";--> statement-breakpoint
DROP TYPE "public"."year";