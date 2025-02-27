import { queryOptions } from "@tanstack/react-query";

import {
  $listHistoricalSystemAlerts,
  $listSystemAlerts,
} from "@/server/functions/system-alert";

export const systemAlertKeys = {
  all: () => [{ scope: "systemAlerts" }] as const,
  list: (
    filters: {
      isResolved?: boolean;
    } = {},
  ) => [{ ...systemAlertKeys.all()[0], ...filters }] as const,
  historical: (
    filters: {
      startDate?: string;
      endDate?: string;
      page?: number;
      pageSize?: number;
    } = {},
  ) =>
    [
      { ...systemAlertKeys.all()[0], action: "historical", ...filters },
    ] as const,
};
export const systemAlertListOptions = ({
  isResolved,
}: {
  isResolved?: boolean;
} = {}) =>
  queryOptions({
    queryKey: systemAlertKeys.list({ isResolved }),
    queryFn: async () => {
      const response = await $listSystemAlerts({ data: { isResolved } });
      return response;
    },
  });
export const systemAlertsHistoricalOptions = ({
  startDate,
  endDate,
  page = 1,
  pageSize = 50,
}: {
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
} = {}) =>
  queryOptions({
    queryKey: systemAlertKeys.historical({
      startDate,
      endDate,
      page,
      pageSize,
    }),
    queryFn: async () => {
      const response = await $listHistoricalSystemAlerts({
        data: { startDate, endDate, page, pageSize },
      });
      return response;
    },
  });
