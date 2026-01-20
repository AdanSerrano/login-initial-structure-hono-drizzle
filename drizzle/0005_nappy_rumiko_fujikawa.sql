CREATE TABLE `refresh_tokens` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	`ip_address` varchar(45),
	`user_agent` varchar(500),
	`device_name` varchar(100),
	`last_used_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `refresh_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `refresh_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `audit_logs` MODIFY COLUMN `audit_action` enum('LOGIN_SUCCESS','LOGIN_FAILED','LOGOUT','PASSWORD_RESET_REQUESTED','PASSWORD_RESET_COMPLETED','EMAIL_VERIFIED','EMAIL_VERIFICATION_RESENT','TWO_FACTOR_ENABLED','TWO_FACTOR_DISABLED','TWO_FACTOR_VERIFIED','BACKUP_CODES_GENERATED','BACKUP_CODE_USED','SESSION_REVOKED','ACCOUNT_LOCKED','ACCOUNT_UNLOCKED','ACCOUNT_BLOCKED','ACCOUNT_UNBLOCKED','ACCOUNT_DELETED','ACCOUNT_REACTIVATED','ACCOUNT_ANONYMIZED','REGISTRATION') NOT NULL;--> statement-breakpoint
CREATE INDEX `refresh_tokens_user_idx` ON `refresh_tokens` (`user_id`);--> statement-breakpoint
CREATE INDEX `refresh_tokens_token_idx` ON `refresh_tokens` (`token`);--> statement-breakpoint
CREATE INDEX `refresh_tokens_expires_idx` ON `refresh_tokens` (`expires_at`);