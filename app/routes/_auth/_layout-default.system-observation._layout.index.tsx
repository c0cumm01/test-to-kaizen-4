import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";

import { BasicTable } from "@/components/tables/basic-table";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { systemAlertListOptions } from "@/query/options/system-alert";
import { systemMetricListOptions } from "@/query/options/system-metric";

/**
 * This route displays spaceship system metrics and active alerts.
 * It provides real-time style monitoring (via repeated queries)
 * for quick identification of anomalies or incidents.
 */
export const Route = createFileRoute(
  "/_auth/_layout-default/system-observation/_layout/"
)({
  component: SystemObservationPage,
  loader: async (opts) => {
    // Ensure both system metrics and system alerts are prefetched
    return Promise.all([
      opts.context.queryClient.ensureQueryData(systemMetricListOptions({})),
      opts.context.queryClient.ensureQueryData(
        systemAlertListOptions({ isResolved: false })
      ),
    ]);
  },
});

function SystemObservationPage() {
  // Fetch all system metrics
  const { data: systemMetricsData } = useSuspenseQuery(
    systemMetricListOptions({})
  );
  // Fetch only active/unresolved alerts
  const { data: systemAlertsData } = useSuspenseQuery(
    systemAlertListOptions({ isResolved: false })
  );

  const flatSystemMetrics = React.useMemo(
    () => systemMetricsData?.systemMetrics?.map(item => item.systemMetric) ?? [],
    [systemMetricsData]
  );

  const flatSystemAlerts = React.useMemo(
    () => systemAlertsData?.systemAlerts?.map(item => item.systemAlert) ?? [],
    [systemAlertsData]
  );

  // Build the columns for the system metrics table
  const metricsColumnHelper = React.useMemo(
    () => createColumnHelper<typeof flatSystemMetrics[number]>(),
    [flatSystemMetrics]
  );
  const metricsColumns = React.useMemo(
    () => [
      metricsColumnHelper.accessor("systemName", {
        header: "System Name",
        footer: (info) => info.column.id,
      }),
      metricsColumnHelper.accessor("metricName", {
        header: "Metric Name",
        footer: (info) => info.column.id,
      }),
      metricsColumnHelper.accessor("metricValue", {
        header: "Value",
        footer: (info) => info.column.id,
      }),
      metricsColumnHelper.accessor((row) => formatDate(row.recordedAt), {
        id: "recordedAt",
        header: "Recorded At",
        footer: (info) => info.column.id,
      }),
    ],
    [metricsColumnHelper]
  );
  // Build the columns for the active alerts table
  const alertsColumnHelper = React.useMemo(
    () => createColumnHelper<typeof flatSystemAlerts[number]>(),
    [flatSystemAlerts]
  );
  const alertsColumns = React.useMemo(
    () => [
      alertsColumnHelper.accessor("systemName", {
        header: "System",
        footer: (info) => info.column.id,
      }),
      alertsColumnHelper.accessor("alertDescription", {
        header: "Description",
        footer: (info) => info.column.id,
      }),
      alertsColumnHelper.accessor("severity", {
        header: "Severity",
        footer: (info) => info.column.id,
      }),
      alertsColumnHelper.accessor((row) => formatDate(row.triggeredAt), {
        id: "triggeredAt",
        header: "Triggered At",
        footer: (info) => info.column.id,
      }),
    ],
    [alertsColumnHelper]
  );
  return (
    <div className="flex flex-col gap-4 p-8">
      <Card>
        <CardContent>
          <h1 className="mb-4 text-2xl font-bold">System Metrics</h1>
          <BasicTable
            columns={metricsColumns}
            data={flatSystemMetrics}
            caption="Real-time metrics for each spaceship system."
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h1 className="mb-4 text-2xl font-bold">Active Alerts</h1>
          <BasicTable
            columns={alertsColumns}
            data={flatSystemAlerts}
            caption="List of unresolved system alerts requiring attention."
          />
        </CardContent>
      </Card>
    </div>
  );
}