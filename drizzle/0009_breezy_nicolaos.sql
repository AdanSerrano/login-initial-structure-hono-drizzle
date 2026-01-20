CREATE TABLE `oauth_accounts` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`provider` varchar(50) NOT NULL,
	`provider_account_id` varchar(255) NOT NULL,
	`access_token` varchar(500),
	`refresh_token` varchar(500),
	`expires_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `oauth_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `oauth_account_provider_idx` UNIQUE(`provider`,`provider_account_id`)
);
--> statement-breakpoint
ALTER TABLE `audit_logs` MODIFY COLUMN `audit_action` enum('LOGIN_SUCCESS','LOGIN_FAILED','LOGOUT','PASSWORD_RESET_REQUESTED','PASSWORD_RESET_COMPLETED','EMAIL_VERIFIED','EMAIL_VERIFICATION_RESENT','TWO_FACTOR_ENABLED','TWO_FACTOR_DISABLED','TWO_FACTOR_VERIFIED','BACKUP_CODES_GENERATED','BACKUP_CODE_USED','SESSION_REVOKED','DEVICE_TRUSTED','SUSPICIOUS_LOGIN_DETECTED','ACCOUNT_LOCKED','ACCOUNT_UNLOCKED','ACCOUNT_BLOCKED','ACCOUNT_UNBLOCKED','ACCOUNT_DELETED','ACCOUNT_REACTIVATED','ACCOUNT_ANONYMIZED','REGISTRATION','EMAIL_CHANGE_REQUESTED','EMAIL_CHANGED','OAUTH_ACCOUNT_LINKED','OAUTH_ACCOUNT_UNLINKED','OAUTH_LOGIN') NOT NULL;--> statement-breakpoint
CREATE INDEX `oauth_account_user_idx` ON `oauth_accounts` (`user_id`);