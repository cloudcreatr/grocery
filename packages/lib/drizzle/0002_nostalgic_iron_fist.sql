CREATE TABLE "product_availabile" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"img" text NOT NULL,
	"category_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "product_category_id_category_id_fk";
--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "product_available" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "product_availabile" ADD CONSTRAINT "product_availabile_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cateogoryId" ON "product_availabile" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "product_available_name_index" ON "product_availabile" USING btree ("name");--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_product_available_product_availabile_id_fk" FOREIGN KEY ("product_available") REFERENCES "public"."product_availabile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "category_name_index" ON "category" USING btree ("id");--> statement-breakpoint
CREATE INDEX "product_name_index" ON "product" USING btree ("name");--> statement-breakpoint
CREATE INDEX "product_store_index" ON "product" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "product_available_index" ON "product" USING btree ("product_available");--> statement-breakpoint
CREATE INDEX "product_category_index" ON "product" USING btree ("product_available");--> statement-breakpoint
CREATE INDEX "product_idex" ON "product" USING btree ("id");--> statement-breakpoint
ALTER TABLE "product" DROP COLUMN "category_id";