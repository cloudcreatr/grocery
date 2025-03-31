CREATE TABLE `bank` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`details` blob,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `product` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`description` text,
	`category` text,
	`store_id` integer NOT NULL,
	`img` blob,
	`price` real,
	FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `store` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`description` text,
	`user_id` integer NOT NULL,
	`img` text,
	`lat` real,
	`long` real,
	`address` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `user` ADD `name` text;--> statement-breakpoint
ALTER TABLE `user` ADD `doc` blob;--> statement-breakpoint
ALTER TABLE `user` ADD `phone` text;--> statement-breakpoint
ALTER TABLE `user` ADD `address` text;--> statement-breakpoint
ALTER TABLE `user` ADD `lat` real;--> statement-breakpoint
ALTER TABLE `user` ADD `long` real;