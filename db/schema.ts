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
  'ACCOUNT_LOCKED',
  'ACCOUNT_UNLOCKED',
  'ACCOUNT_BLOCKED',
  'ACCOUNT_UNBLOCKED',
  'ACCOUNT_DELETED',
  'ACCOUNT_REACTIVATED',
  'ACCOUNT_ANONYMIZED',
  'REGISTRATION',
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

// Relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  twoFactorConfirmation: one(twoFactorConfirmationsTable, {
    fields: [usersTable.id],
    references: [twoFactorConfirmationsTable.userId],
  }),
  auditLogs: many(auditLogsTable),
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

export type AuditLog = typeof auditLogsTable.$inferSelect;
export type NewAuditLog = typeof auditLogsTable.$inferInsert;

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
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED'
  | 'ACCOUNT_BLOCKED'
  | 'ACCOUNT_UNBLOCKED'
  | 'ACCOUNT_DELETED'
  | 'ACCOUNT_REACTIVATED'
  | 'ACCOUNT_ANONYMIZED'
  | 'REGISTRATION';
