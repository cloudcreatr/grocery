CREATE TABLE `category` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`description` text,
	`img` text
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_bank` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`details` blob NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_bank`("id", "user_id", "details") SELECT "id", "user_id", "details" FROM `bank`;--> statement-breakpoint
DROP TABLE `bank`;--> statement-breakpoint
ALTER TABLE `__new_bank` RENAME TO `bank`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `product` ADD `category_id` integer NOT NULL REFERENCES category(id);--> statement-breakpoint
ALTER TABLE `product` DROP COLUMN `category`;