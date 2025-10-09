CREATE TYPE "public"."subscription_status" AS ENUM('paused', 'playing');--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "status" "subscription_status" DEFAULT 'playing' NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "next_notification" timestamp;