import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableTicket, type TicketInsert } from "@/server/db/schema";

export async function addTicket(ticket: Omit<TicketInsert, "ticketId">) {
  const results = await db
    .insert(tableTicket)
    .values(ticket)
    .returning({ ticketId: tableTicket.ticketId });
  return results[0];
}
export const deleteTicket = async (ticketId: string) => {
  const results = await db
    .delete(tableTicket)
    .where(eq(tableTicket.ticketId, ticketId))
    .returning();
  return results[0];
};
export const updateTicket = async (
  ticketId: string,
  ticket: {
    issueDescription: string;
    priority: "Low" | "Medium" | "High";
    assignedCrewTeamId: string;
    affectedSystems: string[];
    status: "Open" | "In Progress" | "Completed";
  },
) => {
  const results = await db
    .update(tableTicket)
    .set({
      issueDescription: ticket.issueDescription,
      priority: ticket.priority,
      assignedCrewTeamId: ticket.assignedCrewTeamId,
      affectedSystems: ticket.affectedSystems,
      status: ticket.status,
    })
    .where(eq(tableTicket.ticketId, ticketId))
    .returning();
  return results[0];
};
