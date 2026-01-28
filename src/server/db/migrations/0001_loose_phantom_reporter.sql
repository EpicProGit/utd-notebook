ALTER TABLE "file" RENAME COLUMN "file_name" TO "name";--> statement-breakpoint
ALTER TABLE "file" RENAME COLUMN "edited_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "file" DROP CONSTRAINT "file_likes_nonneg";--> statement-breakpoint
ALTER TABLE "file" DROP CONSTRAINT "file_saves_nonneg";--> statement-breakpoint
DROP INDEX "file_title_unique_idx";--> statement-breakpoint
DROP INDEX "file_by_publish_date_idx";--> statement-breakpoint
DROP INDEX "section_by_professor_idx";--> statement-breakpoint
ALTER TABLE "file" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "file" ALTER COLUMN "id" SET DEFAULT nanoid(20);--> statement-breakpoint
ALTER TABLE "file" ALTER COLUMN "section_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "section" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "section" ALTER COLUMN "id" SET DEFAULT nanoid(20);--> statement-breakpoint
ALTER TABLE "file" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "file" ADD COLUMN "public_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "section" ADD COLUMN "prof_first" text NOT NULL;--> statement-breakpoint
ALTER TABLE "section" ADD COLUMN "prof_last" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "file_name_unique_idx" ON "file" USING btree ("author_id","name");--> statement-breakpoint
CREATE INDEX "section_by_professor_idx" ON "section" USING btree ("prof_first","prof_last");--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "file_title";--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "publish_date";--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "likes";--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "saves";--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "edited";--> statement-breakpoint
ALTER TABLE "file" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "section" DROP COLUMN "professor";--> statement-breakpoint
ALTER TABLE "section" DROP COLUMN "number_of_notes";--> statement-breakpoint
ALTER TABLE "section" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "section" DROP COLUMN "updated_at";