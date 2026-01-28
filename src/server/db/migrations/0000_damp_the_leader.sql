CREATE TYPE "public"."term" AS ENUM('Spring', 'Summer', 'Fall');--> statement-breakpoint
CREATE TYPE "public"."year" AS ENUM('Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad Student');--> statement-breakpoint
CREATE TABLE "admin" (
	"userId" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file" (
	"id" varchar(20) PRIMARY KEY DEFAULT nanoid(20) NOT NULL,
	"author_id" text NOT NULL,
	"section_id" varchar(6),
	"file_title" text NOT NULL,
	"file_name" text NOT NULL,
	"publish_date" timestamp with time zone DEFAULT now() NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"saves" integer DEFAULT 0 NOT NULL,
	"edited" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"edited_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "file_likes_nonneg" CHECK ("file"."likes" >= 0),
	CONSTRAINT "file_saves_nonneg" CHECK ("file"."saves" >= 0)
);
--> statement-breakpoint
CREATE TABLE "report" (
	"id" text PRIMARY KEY DEFAULT nanoid(20) NOT NULL,
	"user_id" text NOT NULL,
	"file_id" text NOT NULL,
	"category" varchar(32) DEFAULT 'other' NOT NULL,
	"details" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "section" (
	"id" varchar(6) PRIMARY KEY DEFAULT nanoid(6) NOT NULL,
	"prefix" varchar(4) NOT NULL,
	"number" varchar(4) NOT NULL,
	"section_code" varchar(3) NOT NULL,
	"term" "term" NOT NULL,
	"year" smallint NOT NULL,
	"professor" text,
	"number_of_notes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_metadata" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"major" text NOT NULL,
	"minor" text,
	"year" "year" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin" ADD CONSTRAINT "admin_userId_user_metadata_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_author_id_user_metadata_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_section_id_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."section"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_user_id_user_metadata_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_metadata"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_file_id_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "file_title_unique_idx" ON "file" USING btree ("author_id","file_title");--> statement-breakpoint
CREATE INDEX "file_by_author_idx" ON "file" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "file_by_section_idx" ON "file" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "file_by_publish_date_idx" ON "file" USING btree ("publish_date");--> statement-breakpoint
CREATE UNIQUE INDEX "section_unique_idx" ON "section" USING btree ("prefix","number","section_code","term","year");--> statement-breakpoint
CREATE INDEX "section_by_course_idx" ON "section" USING btree ("prefix","number");--> statement-breakpoint
CREATE INDEX "section_by_professor_idx" ON "section" USING btree ("professor");--> statement-breakpoint
CREATE INDEX "section_by_semester_idx" ON "section" USING btree ("term","year");