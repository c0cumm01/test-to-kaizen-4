import { createServerFn } from "@tanstack/start";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { authMiddleware } from "@/middleware/auth";
import {
  findTicketsCount,
  findTicketsPaginated,
  getTicket,
} from "@/server/db/queries/ticket/read";
import {
  addTicket,
  deleteTicket,
  updateTicket,
} from "@/server/db/queries/ticket/write";

const GetTicketInfoInput = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
});
export const $getTicketInfo = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(zodValidator(GetTicketInfoInput))
  .handler(async ({ data }) => {
    const ticketInfo = await getTicket(data.ticketId);
    return { ticket: ticketInfo };
  });
const listTicketsInput = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).default(50),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  assignedCrewTeamId: z.string().optional(),
});
export const $listTickets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(zodValidator(listTicketsInput))
  .handler(async ({ data, context }) => {
    const tickets = await findTicketsPaginated(data, context.userId);
    const ticketsCount = await findTicketsCount(data);
    return {
      tickets,
      totalTickets: ticketsCount,
    };
  });
const CreateTicketInput = z.object({
  ticket: z.object({
    issueDescription: z.string().min(1, "Issue Description is required"),
    priority: z.enum(["Low", "Medium", "High"], {
      required_error: "Priority is required",
    }),
    assignedCrewTeamId: z.string().min(1, "Assigned Crew/Team is required"),
    affectedSystems: z.string().optional(),
    status: z.enum(["Open", "In Progress", "Completed"]).default("Open"),
  }),
});
export const $createTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(zodValidator(CreateTicketInput))
  .handler(async ({ data, context }) => {
    // Convert comma-separated string to array
    const systemsArray = data.ticket.affectedSystems
      ? data.ticket.affectedSystems.split(",").map((s) => s.trim())
      : [];
    const payload = {
      ...data,
      ticket: {
        ...data.ticket,
        affectedSystems: systemsArray,
      },
    };
    const ticket = await addTicket({
      ...payload,
      createdByUserId: context.userId,
    });
    return ticket;
  });
const DeleteTicketInput = z.object({
  ticketId: z.string(),
});
export const $deleteTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(zodValidator(DeleteTicketInput))
  .handler(async ({ data }) => {
    await deleteTicket(data.ticketId);
  });
const UpdateTicketInput = z.object({
  ticketId: z.string(),
  ticket: z.object({
    issueDescription: z.string().min(1, "Issue Description is required"),
    priority: z.enum(["Low", "Medium", "High"]),
    assignedCrewTeamId: z.string().min(1, "Assigned Crew/Team is required"),
    affectedSystems: z.string().optional(),
    status: z.enum(["Open", "In Progress", "Completed"]),
  }),
});
export const $updateTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(zodValidator(UpdateTicketInput))
  .handler(async ({ data, context }) => {
    const affectedSystems = data.ticket.affectedSystems
      ? data.ticket.affectedSystems
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const ticket = await updateTicket(data.ticketId, {
      ...data.ticket,
      affectedSystems,
    });
    return ticket;
  });
