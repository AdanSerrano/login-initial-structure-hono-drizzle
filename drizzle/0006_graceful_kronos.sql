CREATE TABLE `trusted_devices` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`device_fingerprint` varchar(255) NOT NULL,
	`device_name` varchar(100),
	`ip_address` varchar(45),
	`trusted_until` datetime NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trusted_devices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `audit_logs` MODIFY COLUMN `audit_action` enum('LOGIN_SUCCESS','LOGIN_FAILED','LOGOUT','PASSWORD_RESET_REQUESTED','PASSWORD_RESET_COMPLETED','EMAIL_VERIFIED','EMAIL_VERIFICATION_RESENT','TWO_FACTOR_ENABLED','TWO_FACTOR_DISABLED','TWO_FACTOR_VERIFIED','BACKUP_CODES_GENERATED','BACKUP_CODE_USED','SESSION_REVOKED','DEVICE_TRUSTED','ACCOUNT_LOCKED','ACCOUNT_UNLOCKED','ACCOUNT_BLOCKED','ACCOUNT_UNBLOCKED','ACCOUNT_DELETED','ACCOUNT_REACTIVATED','ACCOUNT_ANONYMIZED','REGISTRATION') NOT NULL;--> statement-breakpoint
CREATE INDEX `trusted_devices_user_idx` ON `trusted_devices` (`user_id`);--> statement-breakpoint
CREATE INDEX `trusted_devices_fingerprint_idx` ON `trusted_devices` (`device_fingerprint`);--> statement-breakpoint
CREATE INDEX `trusted_devices_expires_idx` ON `trusted_devices` (`trusted_until`);