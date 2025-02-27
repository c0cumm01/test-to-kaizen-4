import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateTicketMutation } from "@/query/mutations/ticket";
import { crewTeamListOptions } from "@/query/options/crew-team";
import { ticketInfoOptions } from "@/query/options/ticket";

export const Route = createFileRoute(
  "/_auth/_layout-default/tickets/$ticketId/edit"
)({
  component: EditTicketPage,
  loader: async (opts) => {
    const { ticketId } = opts.params;
    return Promise.all([
      opts.context.queryClient.ensureQueryData(ticketInfoOptions({ ticketId })),
      opts.context.queryClient.ensureQueryData(crewTeamListOptions()),
    ]);
  },
});
const ticketFormSchema = z.object({
  ticket: z.object({
    issueDescription: z.string().min(1, "Issue Description is required"),
    priority: z.enum(["Low", "Medium", "High"]),
    assignedCrewTeamId: z.string().min(1, "Assigned Crew/Team is required"),
    affectedSystems: z.string().optional(),
    status: z.enum(["Open", "In Progress", "Completed"]),
  }),
});
function EditTicketPage() {
  const { ticketId } = Route.useParams();
  const { data: ticketData } = useSuspenseQuery(
    ticketInfoOptions({ ticketId })
  );
  const { data: crewTeamsData } = useSuspenseQuery(crewTeamListOptions());
  const updateTicketMutation = useUpdateTicketMutation({ ticketId });
  const navigate = Route.useNavigate();
  const form = useForm({
    defaultValues: {
      ticket: {
        issueDescription: ticketData.ticket.issueDescription ?? "",
        priority: ticketData.ticket.priority ?? "Low",
        assignedCrewTeamId: ticketData.ticket.assignedCrewTeamId ?? "",
        affectedSystems: (ticketData.ticket.affectedSystems ?? []).join(", "),
        status: ticketData.ticket.status ?? "Open",
      },
    },
    onSubmit: async ({ value }) => {
      const updatedAffectedSystems = value.ticket.affectedSystems
        ? value.ticket.affectedSystems
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      await updateTicketMutation.mutateAsync(
        {
          ...value.ticket,
          affectedSystems: updatedAffectedSystems,
        },
        {
          onSuccess: () => {
            toast.success("Ticket updated successfully");
            navigate({
              to: "/tickets/$ticketId",
              params: { ticketId },
            });
          },
          onError: () => {
            toast.error("Failed to update ticket");
          },
        }
      );
    },
    validators: {
      onChange: ticketFormSchema,
    },
  });
  const handleCancel = () => {
    navigate({
      to: "/tickets/$ticketId",
      params: { ticketId },
    });
  };
  return (
    <div className="flex flex-col gap-4 p-8">
      <Card>
        <CardContent>
          <h1 className="mb-4 text-2xl font-bold">Edit Ticket</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="ticket.issueDescription"
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Issue Description
                  </label>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="ticket.priority"
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Priority
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value: string) => field.handleChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="ticket.assignedCrewTeamId"
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Assigned Crew/Team
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Crew/Team" />
                    </SelectTrigger>
                    <SelectContent>
                      {crewTeamsData?.crewTeams?.map((team: any) => (
                        <SelectItem
                          key={team.crewTeamId}
                          value={team.crewTeamId}
                        >
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="ticket.affectedSystems"
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Affected Systems
                  </label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
              )}
            />

            <form.Field
              name="ticket.status"
              children={(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value: string) => field.handleChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            <div className="flex space-x-2">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? "..." : "Save"}
                  </Button>
                )}
              />
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}