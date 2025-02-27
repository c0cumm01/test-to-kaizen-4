import { and, desc, eq, sql, SQL } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableCrewTeam, tableTicket } from "@/server/db/schema";

export const findTicketsCount = async ({
  priority,
  assignedCrewTeamId,
}: {
  priority?: "Low" | "Medium" | "High";
  assignedCrewTeamId?: string;
}) => {
  const whereConditions: (SQL | undefined)[] = [];
  if (priority) {
    whereConditions.push(eq(tableTicket.priority, priority));
  }
  if (assignedCrewTeamId) {
    whereConditions.push(
      eq(tableTicket.assignedCrewTeamId, assignedCrewTeamId),
    );
  }
  const results = await db
    .select({ count: sql<number>`count(*)` })
    .from(tableTicket)
    .where(and(...whereConditions));
  return results[0]?.count ?? 0;
};
export async function findTicketsPaginated(
  data: {
    page: number;
    pageSize: number;
    priority?: "Low" | "Medium" | "High" | undefined;
    assignedCrewTeamId?: string | undefined;
  },
  userId: string,
) {
  const { page, pageSize, priority, assignedCrewTeamId } = data;
  const offset = (page - 1) * pageSize;
  const whereConditions: (SQL | undefined)[] = [];
  if (priority) {
    whereConditions.push(eq(tableTicket.priority, priority));
  }
  if (assignedCrewTeamId) {
    whereConditions.push(
      eq(tableTicket.assignedCrewTeamId, assignedCrewTeamId),
    );
  }
  let query = db
    .select({
      ticket: tableTicket,
      assignedCrewTeamName: tableCrewTeam.name,
    })
    .from(tableTicket)
    .leftJoin(
      tableCrewTeam,
      eq(tableTicket.assignedCrewTeamId, tableCrewTeam.crewTeamId),
    )
    .limit(pageSize)
    .offset(offset)
    .orderBy(desc(tableTicket.createdAt));
  if (whereConditions.length > 0) {
    query = query.where(and(...whereConditions));
  }
  const results = await query;
  return results;
}
export const getTicket = async (ticketId: string) => {
  const results = await db
    .select()
    .from(tableTicket)
    .where(eq(tableTicket.ticketId, ticketId));
  return results[0];
};
