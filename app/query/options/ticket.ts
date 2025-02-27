import { queryOptions } from "@tanstack/react-query";

import { $listCrewTeams } from "@/server/functions/crew-team";
import { $getTicketInfo, $listTickets } from "@/server/functions/ticket";

// NOTE: import paths should always use - instead of CamelCase or PascalCase
// For example: import {$createWidget, $editWidget, $deleteWidget} from "@/server/functions/userActions"; should actually be import {$createWidget, $editWidget, $deleteWidget} from "@/server/functions/user-actions";
// the last part of the path should always be singular
export const ticketKeys = {
  all: () => [{ scope: "tickets" }] as const,
  byId: ({ ticketId }: { ticketId: string }) =>
    [{ ...ticketKeys.all()[0], ticketId }] as const,
  list: (
    filters: {
      page?: number;
      pageSize?: number;
      priority?: "Low" | "Medium" | "High";
      assignedCrewTeamId?: string;
    } = {},
  ) => [{ ...ticketKeys.all()[0], ...filters }] as const,
};
export const ticketInfoOptions = ({ ticketId }: { ticketId: string }) =>
  queryOptions({
    queryKey: ticketKeys.byId({ ticketId }),
    queryFn: async () => {
      const response = await $getTicketInfo({ data: { ticketId } });
      return response ?? null;
    },
  });
export const ticketsListOptions = ({
  page = 1,
  pageSize = 50,
  priority,
  assignedCrewTeamId,
}: {
  page?: number;
  pageSize?: number;
  priority?: "Low" | "Medium" | "High";
  assignedCrewTeamId?: string;
} = {}) =>
  queryOptions({
    queryKey: ticketKeys.list({ page, pageSize, priority, assignedCrewTeamId }),
    queryFn: async () => {
      const response = await $listTickets({
        data: { page, pageSize, priority, assignedCrewTeamId },
      });
      return response;
    },
  });
export const crewTeamKeys = {
  all: () => [{ scope: "crewTeams" }] as const,
  list: () => [{ ...crewTeamKeys.all()[0] }] as const,
};
export const crewTeamListOptions = () =>
  queryOptions({
    queryKey: crewTeamKeys.list(),
    queryFn: async () => {
      const response = await $listCrewTeams();
      return response;
    },
  });
