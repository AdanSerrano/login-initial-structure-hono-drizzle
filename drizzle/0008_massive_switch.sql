CREATE TABLE `email_change_requests` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`current_email` varchar(255) NOT NULL,
	`new_email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_change_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_change_requests_token_unique` UNIQUE(`token`),
	CONSTRAINT `email_change_token_idx` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `audit_logs` MODIFY COLUMN `audit_action` enum('LOGIN_SUCCESS','LOGIN_FAILED','LOGOUT','PASSWORD_RESET_REQUESTED','PASSWORD_RESET_COMPLETED','EMAIL_VERIFIED','EMAIL_VERIFICATION_RESENT','TWO_FACTOR_ENABLED','TWO_FACTOR_DISABLED','TWO_FACTOR_VERIFIED','BACKUP_CODES_GENERATED','BACKUP_CODE_USED','SESSION_REVOKED','DEVICE_TRUSTED','SUSPICIOUS_LOGIN_DETECTED','ACCOUNT_LOCKED','ACCOUNT_UNLOCKED','ACCOUNT_BLOCKED','ACCOUNT_UNBLOCKED','ACCOUNT_DELETED','ACCOUNT_REACTIVATED','ACCOUNT_ANONYMIZED','REGISTRATION','EMAIL_CHANGE_REQUESTED','EMAIL_CHANGED') NOT NULL;--> statement-breakpoint
CREATE INDEX `email_change_user_idx` ON `email_change_requests` (`user_id`);--> statement-breakpoint
CREATE INDEX `email_change_expires_idx` ON `email_change_requests` (`expires_at`);