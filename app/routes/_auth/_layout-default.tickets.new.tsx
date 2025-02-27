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
import { useCreateTicketMutation } from "@/query/mutations/ticket";
import { crewTeamsListOptions } from "@/query/options/crew-team";

export const Route = createFileRoute("/_auth/_layout-default/tickets/new")({
  component: CreateTicketPage,
});
const createTicketFormSchema = z.object({
  ticket: z.object({
    issueDescription: z.string().min(1, "Issue Description is required"),
    priority: z.enum(["Low", "Medium", "High"], {
      required_error: "Priority is required",
    }),
    assignedCrewTeamId: z.string().min(1, "Assigned Crew/Team is required"),
    affectedSystems: z.string().optional(),
  }),
});
function CreateTicketPage() {
  const navigate = Route.useNavigate();
  const createTicketMutation = useCreateTicketMutation();
  const { data: crewTeamsData } = useSuspenseQuery(crewTeamsListOptions());
  const form = useForm({
    defaultValues: {
      ticket: {
        issueDescription: "",
        priority: "Low",
        assignedCrewTeamId: "",
        affectedSystems: "",
      },
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        ticket: {
          ...value.ticket,
          status: "Open", // Default status
          affectedSystems: value.ticket.affectedSystems,
        },
      };
      await createTicketMutation.mutateAsync(payload, {
        onSuccess: (data) => {
          toast.success("Ticket created successfully");
          navigate({
            to: "/tickets/$ticketId",
            params: { ticketId: data.ticketId },
          });
        },
        onError: () => {
          toast.error("An Error Occurred");
        },
      });
    },
    validators: {
      onChange: createTicketFormSchema,
    },
  });
  const handleCancel = () => {
    navigate({ to: "/tickets" });
  };
  return (
    <div className="flex flex-col gap-4 p-8">
      <Card>
        <CardContent>
          <h1 className="mb-4 text-2xl font-bold">Create New Ticket</h1>
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
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Describe the issue..."
                  />
                  {field.state.meta.errors?.[0] && (
                    <p className="mt-2 text-sm text-red-600">
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
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors?.[0] && (
                    <p className="mt-2 text-sm text-red-600">
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
                      <SelectValue placeholder="Select a crew/team" />
                    </SelectTrigger>
                    <SelectContent>
                      {crewTeamsData?.crewTeams?.map((team) => (
                        <SelectItem
                          key={team.crewTeamId}
                          value={team.crewTeamId}
                        >
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors?.[0] && (
                    <p className="mt-2 text-sm text-red-600">
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
                    Affected Systems (comma-separated)
                  </label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Life Support, Navigation"
                  />
                </div>
              )}
            />
            <div className="flex space-x-2 pt-4">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? "..." : "Save"}
                  </Button>
                )}
              </form.Subscribe>
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
export default CreateTicketPage;