import { and, eq, gte, lte, SQL } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableSystemAlert } from "@/server/db/schema";

export const findHistoricalSystemAlerts = async ({
  startDate,
  endDate,
  page = 1,
  pageSize = 50,
}: {
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}) => {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;
  const whereConditions = and(
    startDate
      ? gte(tableSystemAlert.triggeredAt, new Date(startDate).getTime() / 1000)
      : undefined,
    endDate
      ? lte(tableSystemAlert.triggeredAt, new Date(endDate).getTime() / 1000)
      : undefined,
  );
  const alerts = await db
    .select({
      systemAlert: tableSystemAlert,
    })
    .from(tableSystemAlert)
    .where(whereConditions)
    .limit(limit)
    .offset(offset);
  return { alerts };
};
export const findSystemAlerts = async ({
  isResolved,
}: {
  isResolved?: boolean;
}) => {
  const whereConditions: (SQL<unknown> | undefined)[] = [];
  if (isResolved !== undefined) {
    whereConditions.push(eq(tableSystemAlert.isResolved, isResolved ? 1 : 0));
  }
  const systemAlerts = await db
    .select({
      systemAlert: tableSystemAlert,
    })
    .from(tableSystemAlert)
    .where(and(...whereConditions));
  return { systemAlerts };
};
