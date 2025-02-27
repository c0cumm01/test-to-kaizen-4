import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { ticketKeys } from "@/query/options/ticket";
import {
  $createTicket,
  $deleteTicket,
  $updateTicket,
} from "@/server/functions/ticket";

type CreateTicketInput = Parameters<typeof $createTicket>[0]["data"];
export function useCreateTicketMutation() {
  return useMutation({
    mutationFn: async (data: CreateTicketInput) => {
      const result = await $createTicket({ data });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ticketKeys.all(),
      });
    },
  });
}
type UpdateTicketInput = Omit<
  Parameters<typeof $updateTicket>[0]["data"],
  "ticketId"
>;
export function useUpdateTicketMutation({ ticketId }: { ticketId: string }) {
  return useMutation({
    mutationFn: async (data: UpdateTicketInput) => {
      const result = await $updateTicket({ data: { ticketId, ...data } });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ticketKeys.byId({ ticketId }),
      });
      queryClient.invalidateQueries({
        queryKey: ticketKeys.all(),
      });
    },
  });
}
export function useDeleteTicketMutation() {
  return useMutation({
    mutationFn: async ({ ticketId }: { ticketId: string }) => {
      const result = await $deleteTicket({ data: { ticketId } });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ticketKeys.all(),
      });
    },
  });
}
