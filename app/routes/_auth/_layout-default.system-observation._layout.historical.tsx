import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, SearchSchemaInput } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { Bar, BarChart } from "recharts";
import { z } from "zod";

import { BasicTable } from "@/components/tables/basic-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { queryClient } from "@/query/client";
import { systemAlertsHistoricalOptions } from "@/query/options/system-alert";
import { systemMetricsHistoricalOptions } from "@/query/options/system-metric";

const historicalSearchSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().catch(1),
  pageSize: z.coerce.number().catch(50),
});
type ZSearchInput = z.input<typeof historicalSearchSchema>;
export const Route = createFileRoute(
  "/_auth/_layout-default/system-observation/_layout/historical",
)({
  component: HistoricalSystemObservationPage,
  validateSearch: (search: ZSearchInput & SearchSchemaInput) =>
    historicalSearchSchema.parse(search),
  loaderDeps: ({ search: { startDate, endDate, page, pageSize } }) => ({
    startDate,
    endDate,
    page,
    pageSize,
  }),
  loader: async (opts) => {
    return Promise.all([
      opts.context.queryClient.ensureQueryData(
        systemMetricsHistoricalOptions({
          startDate: opts.deps.startDate,
          endDate: opts.deps.endDate,
        }),
      ),
      opts.context.queryClient.ensureQueryData(
        systemAlertsHistoricalOptions({
          startDate: opts.deps.startDate,
          endDate: opts.deps.endDate,
          page: opts.deps.page,
          pageSize: opts.deps.pageSize,
        }),
      ),
    ]);
  },
});
function HistoricalSystemObservationPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [localStartDate, setLocalStartDate] = React.useState(
    search.startDate ?? ""
  );
  const [localEndDate, setLocalEndDate] = React.useState(search.endDate ?? "");
  const { data: systemMetricsData } = useSuspenseQuery(
    systemMetricsHistoricalOptions({
      startDate: search.startDate,
      endDate: search.endDate,
    })
  );
  const { data: systemAlertsData } = useSuspenseQuery(
    systemAlertsHistoricalOptions({
      startDate: search.startDate,
      endDate: search.endDate,
      page: search.page,
      pageSize: search.pageSize,
    })
  );
  const alerts = systemAlertsData?.alerts ?? [];
  const chartData = React.useMemo(() => {
    if (!systemMetricsData || !systemMetricsData.metrics) {
      return [];
    }
    return systemMetricsData.metrics.map((item) => {
      return {
        recordedAt: formatDate((item.systemMetric.recordedAt || 0) * 1000),
        metricValue: item.systemMetric.metricValue,
      };
    });
  }, [systemMetricsData]);
  const chartConfig: ChartConfig = {
    metricValue: {
      label: "Metric Value",
      color: "#2563eb",
    },
  };
  const columnHelper = createColumnHelper<typeof alerts[number]>();
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("systemAlert.systemName", {
        header: "System Name",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("systemAlert.alertDescription", {
        header: "Alert Description",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("systemAlert.severity", {
        header: "Severity",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("systemAlert.triggeredAt", {
        header: "Triggered At",
        cell: (info) => formatDate((info.getValue() || 0) * 1000),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("systemAlert.resolvedAt", {
        header: "Resolved At",
        cell: (info) =>
          info.getValue()
            ? formatDate((info.getValue() || 0) * 1000)
            : "Not Resolved",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("systemAlert.isResolved", {
        header: "Is Resolved?",
        cell: (info) => (info.getValue() ? "Yes" : "No"),
        footer: (info) => info.column.id,
      }),
    ],
    [columnHelper]
  );
  const handleApplyFilters = () => {
    navigate({
      to: "/system-observation/historical",
      search: {
        startDate: localStartDate || undefined,
        endDate: localEndDate || undefined,
        page: 1,
        pageSize: 50,
      },
    });
  };
  return (
    <div className="flex flex-col gap-4 p-8">
      <Card>
        <CardContent>
          <h2 className="mb-4 text-xl font-bold">
            Historical System Observation
          </h2>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <Input
                type="date"
                value={localStartDate}
                onChange={(e) => setLocalStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                End Date
              </label>
              <Input
                type="date"
                value={localEndDate}
                onChange={(e) => setLocalEndDate(e.target.value)}
              />
            </div>
            <Button onClick={handleApplyFilters} variant="outline">
              Apply Filters
            </Button>
          </div>
          <div className="my-6">
            <ChartContainer
              config={chartConfig}
              className="min-h-[300px] w-full"
            >
              <BarChart data={chartData}>
                <Bar dataKey="metricValue" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
          <BasicTable
            columns={columns}
            data={alerts}
            caption="Past anomalies or alerts"
          />
        </CardContent>
      </Card>
    </div>
  );
}