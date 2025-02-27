import { ulid } from "@std/ulid";
import {
  AnySQLiteColumn,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { unixNow } from "@/lib/utils/time";

import { createTableColumnsEnum } from "./util";

export const tableUser = sqliteTable("users", {
  userId: text("user_id")
    .primaryKey()
    .$default(() => `u-${ulid()}`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  role: text("role").notNull().default("user"),
  banned: integer("banned", { mode: "boolean" }).notNull().default(false),
  banReason: text("ban_reason"),
  banExpires: integer("ban_expires", { mode: "number" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  deletedAt: integer("deleted_at", { mode: "number" }),
});
export const tableSession = sqliteTable("session", {
  sessionId: text("session_id")
    .primaryKey()
    .$default(() => `s-${ulid()}`),
  userId: text("user_id")
    .notNull()
    .references((): AnySQLiteColumn => tableUser.userId),
  expiresAt: integer("expires_at", { mode: "number" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent").notNull(),
  activeOrganizationId: text("active_organization_id"),
  impersonatedBy: text("impersonated_by"),
  deletedAt: integer("deleted_at", { mode: "number" }),
});
export const tableUserRole = sqliteTable("user_role", {
  userRoleId: text("user_role_id")
    .primaryKey()
    .$default(() => `ur-${ulid()}`),
  userId: text("user_id")
    .notNull()
    .references((): AnySQLiteColumn => tableUser.userId),
  role: text("role").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  deletedAt: integer("deleted_at", { mode: "number" }).notNull(),
});
export const tableAccount = sqliteTable("account", {
  accountId: text("account_id")
    .primaryKey()
    .$default(() => `a-${ulid()}`),
  userId: text("user_id")
    .notNull()
    .references((): AnySQLiteColumn => tableUser.userId),
  providerAccountId: text("provider_account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "number" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "number",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  deletedAt: integer("deleted_at", { mode: "number" }),
});
export const tableVerification = sqliteTable("verification", {
  verificationId: text("verification_id")
    .primaryKey()
    .$default(() => `v-${ulid()}`),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "number" }).notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  deletedAt: integer("deleted_at", { mode: "number" }).notNull(),
});
export const tableOrganization = sqliteTable("organization", {
  organizationId: text("organization_id")
    .primaryKey()
    .$default(() => `org-${ulid()}`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique("slug_unq"),
  logo: text("logo").notNull(),
  metadata: text("metadata")
    .$type<Record<string, string | number | boolean>>()
    .notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  deletedAt: integer("deleted_at", { mode: "number" }),
});
export const tableMember = sqliteTable("member", {
  memberId: text("member_id")
    .primaryKey()
    .$default(() => `m-${ulid()}`),
  organizationId: text("organization_id")
    .notNull()
    .references((): AnySQLiteColumn => tableOrganization.organizationId),
  userId: text("user_id")
    .notNull()
    .references((): AnySQLiteColumn => tableUser.userId),
  role: text("role").notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  deletedAt: integer("deleted_at", { mode: "number" }),
});
export const tableInvitation = sqliteTable("invitation", {
  invitationId: text("invitation_id")
    .primaryKey()
    .$default(() => `i-${ulid()}`),
  organizationId: text("organization_id")
    .notNull()
    .references((): AnySQLiteColumn => tableOrganization.organizationId),
  email: text("email").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull(),
  expiresAt: integer("expires_at", { mode: "number" }).notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references((): AnySQLiteColumn => tableUser.userId),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  deletedAt: integer("deleted_at", { mode: "number" }),
});
export const tableCrewTeam = sqliteTable("crew_team", {
  crewTeamId: text("crew_team_id")
    .primaryKey()
    .$default(() => `ct-${ulid()}`),
  name: text("name").notNull(),
  type: text("type", { enum: ["crew", "team"] }).notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  deletedAt: integer("deleted_at", { mode: "number" }).notNull(),
});
export const tableTicket = sqliteTable("ticket", {
  ticketId: text("ticket_id")
    .primaryKey()
    .$default(() => `t-${ulid()}`),
  issueDescription: text("issue_description").notNull(),
  priority: text("priority", { enum: ["Low", "Medium", "High"] }).notNull(),
  assignedCrewTeamId: text("assigned_crew_team_id")
    .references((): AnySQLiteColumn => tableCrewTeam.crewTeamId)
    .notNull(),
  affectedSystems: text("affected_systems").$type<string[]>(),
  status: text("status", {
    enum: ["Open", "In Progress", "Completed"],
  }).notNull(),
  createdByUserId: text("created_by_user_id")
    .references((): AnySQLiteColumn => tableUser.userId)
    .notNull(),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  deletedAt: integer("deleted_at", { mode: "number" }).notNull(),
});
export const tableSystemMetric = sqliteTable("system_metric", {
  systemMetricId: text("system_metric_id")
    .primaryKey()
    .$default(() => `sm-${ulid()}`),
  systemName: text("system_name").notNull(),
  metricName: text("metric_name").notNull(),
  metricValue: real("metric_value").notNull(),
  recordedAt: integer("recorded_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  deletedAt: integer("deleted_at", { mode: "number" }),
});
export const tableSystemAlert = sqliteTable("system_alert", {
  systemAlertId: text("system_alert_id")
    .primaryKey()
    .$default(() => `sa-${ulid()}`),
  systemName: text("system_name").notNull(),
  alertDescription: text("alert_description").notNull(),
  severity: text("severity").notNull(),
  isResolved: integer("is_resolved", { mode: "boolean" })
    .notNull()
    .default(false),
  triggeredAt: integer("triggered_at", { mode: "number" }).notNull(),
  resolvedAt: integer("resolved_at", { mode: "number" }),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow()),
  updatedAt: integer("updated_at", { mode: "number" })
    .notNull()
    .$defaultFn(() => unixNow())
    .$onUpdate(() => unixNow()),
  deletedAt: integer("deleted_at", { mode: "number" }),
});
export type UserInsert = typeof tableUser.$inferInsert;
export type UserUpdate = Partial<typeof tableUser.$inferSelect>;
export type UserSelect = typeof tableUser.$inferSelect;
export const UserColumns = createTableColumnsEnum(tableUser);
export type SessionInsert = typeof tableSession.$inferInsert;
export type SessionUpdate = Partial<typeof tableSession.$inferSelect>;
export type SessionSelect = typeof tableSession.$inferSelect;
export const SessionColumns = createTableColumnsEnum(tableSession);
export type UserRoleInsert = typeof tableUserRole.$inferInsert;
export type UserRoleUpdate = Partial<typeof tableUserRole.$inferSelect>;
export type UserRoleSelect = typeof tableUserRole.$inferSelect;
export const UserRoleColumns = createTableColumnsEnum(tableUserRole);
export type AccountInsert = typeof tableAccount.$inferInsert;
export type AccountUpdate = Partial<typeof tableAccount.$inferSelect>;
export type AccountSelect = typeof tableAccount.$inferSelect;
export const AccountColumns = createTableColumnsEnum(tableAccount);
export type VerificationInsert = typeof tableVerification.$inferInsert;
export type VerificationUpdate = Partial<typeof tableVerification.$inferSelect>;
export type VerificationSelect = typeof tableVerification.$inferSelect;
export const VerificationColumns = createTableColumnsEnum(tableVerification);
export type OrganizationInsert = typeof tableOrganization.$inferInsert;
export type OrganizationUpdate = Partial<typeof tableOrganization.$inferSelect>;
export type OrganizationSelect = typeof tableOrganization.$inferSelect;
export const OrganizationColumns = createTableColumnsEnum(tableOrganization);
export type MemberInsert = typeof tableMember.$inferInsert;
export type MemberUpdate = Partial<typeof tableMember.$inferSelect>;
export type MemberSelect = typeof tableMember.$inferSelect;
export const MemberColumns = createTableColumnsEnum(tableMember);
export type InvitationInsert = typeof tableInvitation.$inferInsert;
export type InvitationUpdate = Partial<typeof tableInvitation.$inferSelect>;
export type InvitationSelect = typeof tableInvitation.$inferSelect;
export const InvitationColumns = createTableColumnsEnum(tableInvitation);
export type CrewTeamInsert = typeof tableCrewTeam.$inferInsert;
export type CrewTeamUpdate = Partial<typeof tableCrewTeam.$inferSelect>;
export type CrewTeamSelect = typeof tableCrewTeam.$inferSelect;
export const CrewTeamColumns = createTableColumnsEnum(tableCrewTeam);
export type TicketInsert = typeof tableTicket.$inferInsert;
export type TicketUpdate = Partial<typeof tableTicket.$inferSelect>;
export type TicketSelect = typeof tableTicket.$inferSelect;
export const TicketColumns = createTableColumnsEnum(tableTicket);
export type SystemMetricInsert = typeof tableSystemMetric.$inferInsert;
export type SystemMetricUpdate = Partial<typeof tableSystemMetric.$inferSelect>;
export type SystemMetricSelect = typeof tableSystemMetric.$inferSelect;
export const SystemMetricColumns = createTableColumnsEnum(tableSystemMetric);
export type SystemAlertInsert = typeof tableSystemAlert.$inferInsert;
export type SystemAlertUpdate = Partial<typeof tableSystemAlert.$inferSelect>;
export type SystemAlertSelect = typeof tableSystemAlert.$inferSelect;
export const SystemAlertColumns = createTableColumnsEnum(tableSystemAlert);
