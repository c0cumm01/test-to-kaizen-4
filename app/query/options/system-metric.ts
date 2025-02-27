import { queryOptions } from "@tanstack/react-query";

import {
  $listHistoricalSystemMetrics,
  $listSystemMetrics,
} from "@/server/functions/system-metric";

export const systemMetricKeys = {
  all: () => [{ scope: "systemMetrics" }] as const,
  historical: ({
    startDate,
    endDate,
  }: {
    startDate?: string;
    endDate?: string;
  }) => [{ ...systemMetricKeys.all()[0], startDate, endDate }] as const,
};
export const systemMetricListOptions = ({
  page,
  pageSize,
}: {
  page?: number;
  pageSize?: number;
} = {}) =>
  queryOptions({
    queryKey: systemMetricKeys.all(),
    queryFn: async () => {
      const response = await $listSystemMetrics({ data: { page, pageSize } });
      return response;
    },
  });
export const systemMetricsHistoricalOptions = ({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
} = {}) =>
  queryOptions({
    queryKey: systemMetricKeys.historical({ startDate, endDate }),
    queryFn: async () => {
      const response = await $listHistoricalSystemMetrics({
        data: { startDate, endDate },
      });
      return response;
    },
  });
