import { createServerFn } from "@tanstack/start";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { authMiddleware } from "@/middleware/auth";
import {
  findHistoricalSystemMetrics,
  findSystemMetricsCount,
  findSystemMetricsPaginated,
} from "@/server/db/queries/system-metric/read";

const listHistoricalSystemMetricsInput = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
export const $listHistoricalSystemMetrics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(zodValidator(listHistoricalSystemMetricsInput))
  .handler(async ({ data, context }) => {
    const metrics = await findHistoricalSystemMetrics(data);
    return { metrics };
  });
const listSystemMetricsInput = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(50),
});
export const $listSystemMetrics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(zodValidator(listSystemMetricsInput))
  .handler(async ({ data, context }) => {
    const systemMetrics = await findSystemMetricsPaginated(data);
    const systemMetricsCount = await findSystemMetricsCount();
    return {
      systemMetrics,
      totalSystemMetrics: systemMetricsCount,
    };
  });
