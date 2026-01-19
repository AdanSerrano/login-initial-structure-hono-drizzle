CREATE TABLE `audit_logs` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36),
	`audit_action` enum('LOGIN_SUCCESS','LOGIN_FAILED','LOGOUT','PASSWORD_RESET_REQUESTED','PASSWORD_RESET_COMPLETED','EMAIL_VERIFIED','EMAIL_VERIFICATION_RESENT','TWO_FACTOR_ENABLED','TWO_FACTOR_DISABLED','TWO_FACTOR_VERIFIED','ACCOUNT_LOCKED','ACCOUNT_UNLOCKED','ACCOUNT_BLOCKED','ACCOUNT_UNBLOCKED','REGISTRATION') NOT NULL,
	`ip_address` varchar(45),
	`user_agent` varchar(500),
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` datetime NOT NULL,
	CONSTRAINT `password_reset_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `password_reset_tokens_token_unique` UNIQUE(`token`),
	CONSTRAINT `password_reset_email_token_idx` UNIQUE(`email`,`token`)
);
--> statement-breakpoint
CREATE TABLE `two_factor_confirmations` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `two_factor_confirmations_id` PRIMARY KEY(`id`),
	CONSTRAINT `two_factor_confirmations_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `two_factor_tokens` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` datetime NOT NULL,
	CONSTRAINT `two_factor_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `two_factor_tokens_token_unique` UNIQUE(`token`),
	CONSTRAINT `two_factor_email_token_idx` UNIQUE(`email`,`token`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`user_name` varchar(255),
	`name` varchar(255),
	`email` varchar(255),
	`email_verified` datetime,
	`image` varchar(500),
	`password` varchar(255),
	`role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
	`is_two_factor_enabled` boolean NOT NULL DEFAULT false,
	`two_factor_secret` varchar(255),
	`failed_login_attempts` int NOT NULL DEFAULT 0,
	`locked_until` datetime,
	`last_failed_login` datetime,
	`is_blocked` boolean NOT NULL DEFAULT false,
	`blocked_reason` varchar(500),
	`blocked_at` datetime,
	`blocked_actions` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_user_name_unique` UNIQUE(`user_name`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification_tokens` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` datetime NOT NULL,
	CONSTRAINT `verification_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `verification_tokens_token_unique` UNIQUE(`token`),
	CONSTRAINT `verification_email_token_idx` UNIQUE(`email`,`token`)
);
--> statement-breakpoint
CREATE INDEX `audit_log_user_idx` ON `audit_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `audit_log_action_idx` ON `audit_logs` (`audit_action`);--> statement-breakpoint
CREATE INDEX `audit_log_created_idx` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `two_factor_confirmation_user_idx` ON `two_factor_confirmations` (`user_id`);