import {
  mysqlTable,
  varchar,
  timestamp,
  boolean,
  int,
  mysqlEnum,
  json,
  datetime,
  index,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = mysqlEnum('role', ['USER', 'ADMIN']);
export const twoFactorMethodEnum = mysqlEnum('two_factor_method', ['EMAIL', 'AUTHENTICATOR']);

export const auditActionEnum = mysqlEnum('audit_action', [
  'LOGIN_SUCCESS',
  'LOGIN_FAILED',
  'LOGOUT',
  'PASSWORD_RESET_REQUESTED',
  'PASSWORD_RESET_COMPLETED',
  'EMAIL_VERIFIED',
  'EMAIL_VERIFICATION_RESENT',
  'TWO_FACTOR_ENABLED',
  'TWO_FACTOR_DISABLED',
  'TWO_FACTOR_VERIFIED',
  'BACKUP_CODES_GENERATED',
  'BACKUP_CODE_USED',
  'SESSION_REVOKED',
  'DEVICE_TRUSTED',
  'SUSPICIOUS_LOGIN_DETECTED',
  'ACCOUNT_LOCKED',
  'ACCOUNT_UNLOCKED',
  'ACCOUNT_BLOCKED',
  'ACCOUNT_UNBLOCKED',
  'ACCOUNT_DELETED',
  'ACCOUNT_REACTIVATED',
  'ACCOUNT_ANONYMIZED',
  'REGISTRATION',
  'EMAIL_CHANGE_REQUESTED',
  'EMAIL_CHANGED',
  'MAGIC_LINK_SENT',
  'MAGIC_LINK_LOGIN',
]);

// Blocked actions - actions that can be individually blocked for a user
export type BlockedAction =
  | 'LOGIN'
  | 'PASSWORD_CHANGE'
  | 'EMAIL_CHANGE'
  | 'PROFILE_UPDATE'
  | 'TWO_FACTOR_SETUP'
  | 'API_ACCESS';

// Users table
export const usersTable = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userName: varchar('user_name', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  emailVerified: datetime('email_verified'),
  image: varchar('image', { length: 500 }),
  password: varchar('password', { length: 255 }),
  role: roleEnum.default('USER').notNull(),
  isTwoFactorEnabled: boolean('is_two_factor_enabled').default(false).notNull(),
  twoFactorMethod: twoFactorMethodEnum,
  twoFactorSecret: varchar('two_factor_secret', { length: 255 }),
  failedLoginAttempts: int('failed_login_attempts').default(0).notNull(),
  lockedUntil: datetime('locked_until'),
  lastFailedLogin: datetime('last_failed_login'),
  // User blocking fields
  isBlocked: boolean('is_blocked').default(false).notNull(),
  blockedReason: varchar('blocked_reason', { length: 500 }),
  blockedAt: datetime('blocked_at'),
  blockedActions: json('blocked_actions').$type<BlockedAction[]>(),
  // Soft delete field
  deletedAt: datetime('deleted_at'),
  // Last login location for suspicious login detection
  lastLoginCountry: varchar('last_login_country', { length: 100 }),
  lastLoginCity: varchar('last_login_city', { length: 100 }),
  lastLoginIp: varchar('last_login_ip', { length: 45 }),
  lastLoginAt: datetime('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Verification Token table
export const verificationTokensTable = mysqlTable(
  'verification_tokens',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: varchar('email', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expires: datetime('expires').notNull(),
  },
  (table) => [
    uniqueIndex('verification_email_token_idx').on(table.email, table.token),
  ]
);

// Password Reset Token table
export const passwordResetTokensTable = mysqlTable(
  'password_reset_tokens',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: varchar('email', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expires: datetime('expires').notNull(),
  },
  (table) => [
    uniqueIndex('password_reset_email_token_idx').on(table.email, table.token),
  ]
);

// Two Factor Token table
export const twoFactorTokensTable = mysqlTable(
  'two_factor_tokens',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: varchar('email', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expires: datetime('expires').notNull(),
  },
  (table) => [
    uniqueIndex('two_factor_email_token_idx').on(table.email, table.token),
  ]
);

// Magic Link Tokens table
export const magicLinkTokensTable = mysqlTable(
  'magic_link_tokens',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: varchar('email', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expires: datetime('expires').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('magic_link_email_idx').on(table.email),
    uniqueIndex('magic_link_token_idx').on(table.token),
  ]
);

// Two Factor Confirmation table
export const twoFactorConfirmationsTable = mysqlTable(
  'two_factor_confirmations',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar('user_id', { length: 36 }).notNull().unique(),
  },
  (table) => [
    index('two_factor_confirmation_user_idx').on(table.userId),
  ]
);

// Refresh Tokens table (for session management)
export const refreshTokensTable = mysqlTable(
  'refresh_tokens',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar('user_id', { length: 36 }).notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expiresAt: datetime('expires_at').notNull(),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: varchar('user_agent', { length: 500 }),
    deviceName: varchar('device_name', { length: 100 }),
    lastUsedAt: datetime('last_used_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('refresh_tokens_user_idx').on(table.userId),
    index('refresh_tokens_token_idx').on(table.token),
    index('refresh_tokens_expires_idx').on(table.expiresAt),
  ]
);

// Backup Codes table (for 2FA recovery)
export const backupCodesTable = mysqlTable(
  'backup_codes',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar('user_id', { length: 36 }).notNull(),
    codeHash: varchar('code_hash', { length: 255 }).notNull(),
    isUsed: boolean('is_used').default(false).notNull(),
    usedAt: datetime('used_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('backup_codes_user_idx').on(table.userId),
  ]
);

// Trusted Devices table (for "Remember this device" 2FA skip)
export const trustedDevicesTable = mysqlTable(
  'trusted_devices',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar('user_id', { length: 36 }).notNull(),
    deviceFingerprint: varchar('device_fingerprint', { length: 255 }).notNull(),
    deviceName: varchar('device_name', { length: 100 }),
    ipAddress: varchar('ip_address', { length: 45 }),
    trustedUntil: datetime('trusted_until').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('trusted_devices_user_idx').on(table.userId),
    index('trusted_devices_fingerprint_idx').on(table.deviceFingerprint),
    index('trusted_devices_expires_idx').on(table.trustedUntil),
  ]
);

// Email Change Requests table
export const emailChangeRequestsTable = mysqlTable(
  'email_change_requests',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar('user_id', { length: 36 }).notNull(),
    currentEmail: varchar('current_email', { length: 255 }).notNull(),
    newEmail: varchar('new_email', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expiresAt: datetime('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('email_change_user_idx').on(table.userId),
    uniqueIndex('email_change_token_idx').on(table.token),
    index('email_change_expires_idx').on(table.expiresAt),
  ]
);

// Audit Log table
export const auditLogsTable = mysqlTable(
  'audit_logs',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar('user_id', { length: 36 }),
    action: auditActionEnum.notNull(),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: varchar('user_agent', { length: 500 }),
    metadata: json('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('audit_log_user_idx').on(table.userId),
    index('audit_log_action_idx').on(table.action),
    index('audit_log_created_idx').on(table.createdAt),
  ]
);

// Password History table (to prevent reusing recent passwords)
export const passwordHistoryTable = mysqlTable(
  'password_history',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar('user_id', { length: 36 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('password_history_user_idx').on(table.userId),
    index('password_history_created_idx').on(table.createdAt),
  ]
);

// Relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  twoFactorConfirmation: one(twoFactorConfirmationsTable, {
    fields: [usersTable.id],
    references: [twoFactorConfirmationsTable.userId],
  }),
  auditLogs: many(auditLogsTable),
  backupCodes: many(backupCodesTable),
  refreshTokens: many(refreshTokensTable),
  trustedDevices: many(trustedDevicesTable),
  passwordHistory: many(passwordHistoryTable),
}));

export const refreshTokensRelations = relations(refreshTokensTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [refreshTokensTable.userId],
    references: [usersTable.id],
  }),
}));

export const backupCodesRelations = relations(backupCodesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [backupCodesTable.userId],
    references: [usersTable.id],
  }),
}));

export const trustedDevicesRelations = relations(trustedDevicesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [trustedDevicesTable.userId],
    references: [usersTable.id],
  }),
}));

export const twoFactorConfirmationsRelations = relations(twoFactorConfirmationsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [twoFactorConfirmationsTable.userId],
    references: [usersTable.id],
  }),
}));

export const auditLogsRelations = relations(auditLogsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [auditLogsTable.userId],
    references: [usersTable.id],
  }),
}));

export const emailChangeRequestsRelations = relations(emailChangeRequestsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [emailChangeRequestsTable.userId],
    references: [usersTable.id],
  }),
}));

export const passwordHistoryRelations = relations(passwordHistoryTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [passwordHistoryTable.userId],
    references: [usersTable.id],
  }),
}));

// Type exports
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type VerificationToken = typeof verificationTokensTable.$inferSelect;
export type NewVerificationToken = typeof verificationTokensTable.$inferInsert;

export type PasswordResetToken = typeof passwordResetTokensTable.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetTokensTable.$inferInsert;

export type TwoFactorToken = typeof twoFactorTokensTable.$inferSelect;
export type NewTwoFactorToken = typeof twoFactorTokensTable.$inferInsert;

export type TwoFactorConfirmation = typeof twoFactorConfirmationsTable.$inferSelect;
export type NewTwoFactorConfirmation = typeof twoFactorConfirmationsTable.$inferInsert;

export type BackupCode = typeof backupCodesTable.$inferSelect;
export type NewBackupCode = typeof backupCodesTable.$inferInsert;

export type RefreshToken = typeof refreshTokensTable.$inferSelect;
export type NewRefreshToken = typeof refreshTokensTable.$inferInsert;

export type TrustedDevice = typeof trustedDevicesTable.$inferSelect;
export type NewTrustedDevice = typeof trustedDevicesTable.$inferInsert;

export type AuditLog = typeof auditLogsTable.$inferSelect;
export type NewAuditLog = typeof auditLogsTable.$inferInsert;

export type EmailChangeRequest = typeof emailChangeRequestsTable.$inferSelect;
export type NewEmailChangeRequest = typeof emailChangeRequestsTable.$inferInsert;

export type MagicLinkToken = typeof magicLinkTokensTable.$inferSelect;
export type NewMagicLinkToken = typeof magicLinkTokensTable.$inferInsert;

export type PasswordHistory = typeof passwordHistoryTable.$inferSelect;
export type NewPasswordHistory = typeof passwordHistoryTable.$inferInsert;

export type Role = 'USER' | 'ADMIN';
export type TwoFactorMethod = 'EMAIL' | 'AUTHENTICATOR';
export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'EMAIL_VERIFIED'
  | 'EMAIL_VERIFICATION_RESENT'
  | 'TWO_FACTOR_ENABLED'
  | 'TWO_FACTOR_DISABLED'
  | 'TWO_FACTOR_VERIFIED'
  | 'BACKUP_CODES_GENERATED'
  | 'BACKUP_CODE_USED'
  | 'SESSION_REVOKED'
  | 'DEVICE_TRUSTED'
  | 'SUSPICIOUS_LOGIN_DETECTED'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED'
  | 'ACCOUNT_BLOCKED'
  | 'ACCOUNT_UNBLOCKED'
  | 'ACCOUNT_DELETED'
  | 'ACCOUNT_REACTIVATED'
  | 'ACCOUNT_ANONYMIZED'
  | 'REGISTRATION'
  | 'EMAIL_CHANGE_REQUESTED'
  | 'EMAIL_CHANGED'
  | 'MAGIC_LINK_SENT'
  | 'MAGIC_LINK_LOGIN';
