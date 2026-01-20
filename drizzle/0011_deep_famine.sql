CREATE TABLE `password_history` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `password_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `password_history_user_idx` ON `password_history` (`user_id`);--> statement-breakpoint
CREATE INDEX `password_history_created_idx` ON `password_history` (`created_at`);