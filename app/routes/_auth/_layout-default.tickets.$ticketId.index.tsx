import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { useDeleteTicketMutation } from "@/query/mutations/ticket";
import { ticketInfoOptions } from "@/query/options/ticket";

export const Route = createFileRoute(
  "/_auth/_layout-default/tickets/$ticketId/"
)({
  component: TicketDetailPage,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      ticketInfoOptions({
        ticketId: opts.params.ticketId,
      })
    );
  },
});

function TicketDetailPage() {
  const { ticketId } = Route.useParams();
  if (!ticketId) return <div>Ticket ID not provided.</div>;
  const navigate = Route.useNavigate();
  const { data: ticketData } = useSuspenseQuery(
    ticketInfoOptions({ ticketId })
  );
  if (!ticketData?.ticket) {
    return null;
  }
  const ticket = ticketData.ticket;
  return (
    <div className="flex flex-col gap-4 p-8">
      <Card>
        <CardContent>
          <h1 className="mb-4 text-2xl font-bold">Ticket Details</h1>
          <p>
            <strong>Ticket ID:</strong> {ticket.ticketId}
          </p>
          <p>
            <strong>Issue Description:</strong> {ticket.issueDescription}
          </p>
          <p>
            <strong>Priority:</strong> {ticket.priority}
          </p>
          <p>
            <strong>Assigned Crew/Team:</strong> {ticket.assignedCrewTeamId}
          </p>
          <p>
            <strong>Affected Systems:</strong>{" "}
            {ticket.affectedSystems?.join(", ")}
          </p>
          <p>
            <strong>Status:</strong> {ticket.status}
          </p>
          <p>
            <strong>Date Created:</strong> {formatDate(ticket.createdAt)}
          </p>
          <div className="mt-4 flex space-x-2">
            <Button asChild>
              <Link to="/tickets/$ticketId/edit" params={{ ticketId }}>
                Edit Ticket
              </Link>
            </Button>
            <DeleteTicketDialog ticketId={ticket.ticketId} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DeleteTicketDialog({ ticketId }: { ticketId: string }) {
  const deleteTicketMutation = useDeleteTicketMutation();
  const navigate = Route.useNavigate();
  async function handleDelete() {
    await deleteTicketMutation.mutateAsync(
      { ticketId },
      {
        onSuccess: () => {
          toast.success("Ticket deleted successfully");
          navigate({ to: "/tickets" });
        },
        onError: () => {
          toast.error("Failed to delete ticket");
        },
      }
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Ticket</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Ticket</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this ticket? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}