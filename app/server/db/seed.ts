import { faker } from "@faker-js/faker";

import { db } from "./connection";
import {
  tableAccount,
  tableCrewTeam,
  tableInvitation,
  tableMember,
  tableOrganization,
  tableSession,
  tableSystemAlert,
  tableSystemMetric,
  tableTicket,
  tableUser,
  tableUserRole,
  tableVerification,
} from "./schema";

export async function seed() {
  // Create dev user
  const devUser = await db
    .insert(tableUser)
    .values({
      userId: "u-dev-01",
      name: faker.person.fullName(),
      email: faker.internet.email(),
      emailVerified: true,
      image: faker.image.avatar(),
      role: "user",
      banned: false,
      banReason: null,
      banExpires: null,
      createdAt: faker.date.past().getTime(),
      updatedAt: faker.date.recent().getTime(),
      deletedAt: null,
    })
    .returning();
  // Create random users
  const randomUsersData = Array.from({ length: 5 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    emailVerified: faker.datatype.boolean(),
    image: faker.image.avatar(),
    role: faker.helpers.arrayElement(["user", "admin", "user"]),
    banned: faker.datatype.boolean(),
    banReason: null,
    banExpires: null,
    createdAt: faker.date.past().getTime(),
    updatedAt: faker.date.recent().getTime(),
    deletedAt: null,
  }));
  const insertedUsers = await db
    .insert(tableUser)
    .values(randomUsersData)
    .returning();
  const allUsers = [...devUser, ...insertedUsers];
  // Create sessions
  const sessionsData = allUsers.map((u) => ({
    userId: u.userId,
    expiresAt: faker.date.future().getTime(),
    token: faker.string.uuid(),
    ipAddress: faker.internet.ip(),
    userAgent: faker.internet.userAgent(),
    activeOrganizationId: null,
    impersonatedBy: null,
    createdAt: faker.date.past().getTime(),
    updatedAt: faker.date.recent().getTime(),
    deletedAt: null,
  }));
  await db.insert(tableSession).values(sessionsData).returning();
  // Create user roles
  const userRolesData = allUsers.map((u) => ({
    userId: u.userId,
    role: faker.helpers.arrayElement(["user", "admin"]),
    createdAt: faker.date.past().getTime(),
    updatedAt: faker.date.recent().getTime(),
    deletedAt: null,
  }));
  await db.insert(tableUserRole).values(userRolesData).returning();
  // Create accounts
  const accountsData = allUsers.map((u) => ({
    userId: u.userId,
    providerAccountId: faker.string.uuid(),
    providerId: faker.helpers.arrayElement(["google", "github", "email"]),
    accessToken: faker.string.alphanumeric({ length: 20 }),
    refreshToken: faker.string.alphanumeric({ length: 20 }),
    idToken: null,
    accessTokenExpiresAt: faker.date.future().getTime(),
    refreshTokenExpiresAt: faker.date.future().getTime(),
    scope: "read write",
    password: faker.internet.password(),
    createdAt: faker.date.past().getTime(),
    updatedAt: faker.date.recent().getTime(),
    deletedAt: null,
  }));
  await db.insert(tableAccount).values(accountsData).returning();
  // Create verifications
  const verificationsData = Array.from({ length: 3 }).map(() => ({
    identifier: faker.internet.email(),
    value: faker.string.uuid(),
    expiresAt: faker.date.future().getTime(),
    createdAt: faker.date.past().getTime(),
    updatedAt: faker.date.recent().getTime(),
    deletedAt: null,
  }));
  await db.insert(tableVerification).values(verificationsData).returning();
  // Create organizations
  const organizationsData = Array.from({ length: 3 }).map(() => ({
    name: faker.company.name(),
    slug: faker.helpers.slugify(faker.company.name()),
    logo: faker.image.avatar(),
    metadata: JSON.stringify({
      slogan: faker.company.buzzPhrase(),
      employees: faker.number.int({ min: 50, max: 300 }),
    }),
    createdAt: faker.date.past().getTime(),
    updatedAt: faker.date.recent().getTime(),
    deletedAt: null,
  }));
  const insertedOrganizations = await db
    .insert(tableOrganization)
    .values(organizationsData)
    .returning();
  // Create members
  const membersData = insertedOrganizations.flatMap((org) => {
    const numberOfMembers = faker.number.int({ min: 1, max: allUsers.length });
    const usersForOrg = faker.helpers.arrayElements(allUsers, numberOfMembers);
    return usersForOrg.map((u) => ({
      organizationId: org.organizationId,
      userId: u.userId,
      role: faker.helpers.arrayElement(["member", "owner", "admin"]),
      createdAt: faker.date.past().getTime(),
      updatedAt: faker.date.recent().getTime(),
      deletedAt: null,
    }));
  });
  await db.insert(tableMember).values(membersData).returning();
  // Create invitations
  const invitationsData = insertedOrganizations.flatMap((org) => {
    const numberOfInvitations = faker.number.int({ min: 1, max: 3 });
    return Array.from({ length: numberOfInvitations }).map(() => ({
      organizationId: org.organizationId,
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(["member", "owner", "admin"]),
      status: faker.helpers.arrayElement(["pending", "accepted", "rejected"]),
      expiresAt: faker.date.future().getTime(),
      inviterId: faker.helpers.arrayElement(allUsers).userId,
      createdAt: faker.date.past().getTime(),
      updatedAt: faker.date.recent().getTime(),
      deletedAt: null,
    }));
  });
  await db.insert(tableInvitation).values(invitationsData).returning();
  // Create crew teams
  const crewTeamsData = Array.from({ length: 3 }).map(() => ({
    name: faker.company.catchPhrase(),
    type: faker.helpers.arrayElement(["crew", "team"]),
    createdAt: faker.date.past().getTime(),
    updatedAt: faker.date.recent().getTime(),
    deletedAt: null,
  }));
  const insertedCrewTeams = await db
    .insert(tableCrewTeam)
    .values(crewTeamsData)
    .returning();
  // Create tickets
  const ticketsData = Array.from({ length: 5 }).map(() => ({
    issueDescription: faker.lorem.sentence(),
    priority: faker.helpers.arrayElement(["Low", "Medium", "High"]),
    assignedCrewTeamId:
      faker.helpers.arrayElement(insertedCrewTeams).crewTeamId,
    affectedSystems: JSON.stringify([
      faker.word.noun(),
      faker.word.noun(),
      faker.word.noun(),
    ]),
    status: faker.helpers.arrayElement(["Open", "In Progress", "Completed"]),
    createdByUserId: faker.helpers.arrayElement(allUsers).userId,
    createdAt: faker.date.past().getTime(),
    updatedAt: faker.date.recent().getTime(),
    deletedAt: null,
  }));
  await db.insert(tableTicket).values(ticketsData).returning();
  // Create system metrics
  const systemMetricsData = Array.from({ length: 5 }).map(() => ({
    systemName: faker.word.noun(),
    metricName: faker.helpers.arrayElement([
      "CPU_Usage",
      "Memory_Usage",
      "Disk_Space",
    ]),
    metricValue: faker.number.float({ min: 0, max: 100 }),
    recordedAt: faker.date.recent().getTime(),
    createdAt: faker.date.past().getTime(),
    updatedAt: faker.date.recent().getTime(),
    deletedAt: null,
  }));
  await db.insert(tableSystemMetric).values(systemMetricsData).returning();
  // Create system alerts
  const systemAlertsData = Array.from({ length: 5 }).map(() => ({
    systemName: faker.word.noun(),
    alertDescription: faker.hacker.phrase(),
    severity: faker.helpers.arrayElement(["low", "medium", "high"]),
    isResolved: faker.datatype.boolean(),
    triggeredAt: faker.date.past().getTime(),
    resolvedAt: null,
    createdAt: faker.date.past().getTime(),
    updatedAt: faker.date.recent().getTime(),
    deletedAt: null,
  }));
  await db.insert(tableSystemAlert).values(systemAlertsData).returning();
}
await seed();
