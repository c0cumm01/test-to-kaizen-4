import { createServerFn } from "@tanstack/start";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { authMiddleware } from "@/middleware/auth";
import {
  findHistoricalSystemAlerts,
  findSystemAlerts,
} from "@/server/db/queries/system-alert/read";

const ListHistoricalSystemAlertsInput = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().catch(1),
  pageSize: z.number().catch(50),
});
export const $listHistoricalSystemAlerts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(zodValidator(ListHistoricalSystemAlertsInput))
  .handler(async ({ data }) => {
    const alerts = await findHistoricalSystemAlerts(data);
    return { alerts };
  });
const listSystemAlertsInput = z.object({
  isResolved: z.boolean().optional(),
});
export const $listSystemAlerts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(zodValidator(listSystemAlertsInput))
  .handler(async ({ data }) => {
    const systemAlerts = await findSystemAlerts(data);
    return {
      systemAlerts,
    };
  });
