import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  SearchSchemaInput,
} from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { crewTeamsListOptions } from "@/query/options/crew-team";
import { ticketsListOptions } from "@/query/options/ticket";

const ticketsSearchSchema = z.object({
  page: z.coerce.number().min(1).catch(1),
  pageSize: z.coerce.number().min(1).catch(50),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  assignedCrewTeamId: z.string().optional(),
});
type ZSearchInput = z.input<typeof ticketsSearchSchema>;
export const Route = createFileRoute("/_auth/_layout-default/tickets/")({
  component: TicketsListPage,
  validateSearch: (search: ZSearchInput & SearchSchemaInput) =>
    ticketsSearchSchema.parse(search),
  loaderDeps: ({
    search: { page, pageSize, priority, assignedCrewTeamId },
  }) => ({
    page,
    pageSize,
    priority,
    assignedCrewTeamId,
  }),
  loader: (opts) => {
    // Load the tickets (with filters) and the crew teams
    return Promise.all([
      opts.context.queryClient.ensureQueryData(
        ticketsListOptions({
          page: opts.deps.page,
          pageSize: opts.deps.pageSize,
          priority: opts.deps.priority,
          assignedCrewTeamId: opts.deps.assignedCrewTeamId,
        })
      ),
      opts.context.queryClient.ensureQueryData(crewTeamsListOptions()),
    ]);
  },
});
function TicketsListPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: ticketsData } = useSuspenseQuery(
    ticketsListOptions({
      page: search.page,
      pageSize: search.pageSize,
      priority: search.priority,
      assignedCrewTeamId: search.assignedCrewTeamId,
    })
  );
  const { data: crewTeamsData } = useSuspenseQuery(crewTeamsListOptions());
  const columnHelper = React.useMemo(
    () => createColumnHelper<(typeof ticketsData.tickets)[0]>(),
    [ticketsData]
  );
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("ticket.ticketId", {
        header: "Ticket ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("ticket.issueDescription", {
        header: "Issue Description",
        cell: (info) => {
          const val = info.getValue() || "";
          // Truncate if lengthy
          return val.length > 40 ? val.slice(0, 40) + "..." : val;
        },
      }),
      columnHelper.accessor("ticket.priority", {
        header: "Priority",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("assignedCrewTeamName", {
        header: "Assigned Crew/Team",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("ticket.status", {
        header: "Status",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("ticket.createdAt", {
        header: "Created At",
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.display({
        header: "Actions",
        cell: (info) => (
          <Select
            onValueChange={(value) => {
              if (value === "view") {
                navigate({
                  to: "/tickets/$ticketId",
                  params: { ticketId: info.row.original.ticket.ticketId },
                });
              } else if (value === "edit") {
                navigate({
                  to: "/tickets/$ticketId/edit",
                  params: { ticketId: info.row.original.ticket.ticketId },
                });
              }
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="view">View Details</SelectItem>
              <SelectItem value="edit">Edit</SelectItem>
            </SelectContent>
          </Select>
        ),
      }),
    ],
    [columnHelper, navigate]
  );
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select
            value={search.priority ?? ""}
            onValueChange={(value) =>
              navigate({
                search: {
                  ...search,
                  priority: value === "" ? undefined : value,
                },
              })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={search.assignedCrewTeamId ?? ""}
            onValueChange={(value) =>
              navigate({
                search: {
                  ...search,
                  assignedCrewTeamId: value === "" ? undefined : value,
                },
              })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Crew/Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {crewTeamsData?.crewTeams?.map((team) => (
                <SelectItem key={team.crewTeamId} value={team.crewTeamId}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="default" asChild>
          <Link to="/tickets/new">New Ticket</Link>
        </Button>
      </div>
      <Card>
        <CardContent>
          <BasicTable
            columns={columns}
            data={ticketsData.tickets}
            caption="List of maintenance tickets."
          />
        </CardContent>
      </Card>
    </div>
  );
}