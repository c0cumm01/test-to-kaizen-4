import { and, desc, gte, lte, sql, SQL } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableSystemMetric } from "@/server/db/schema";

export const findHistoricalSystemMetrics = async ({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
}) => {
  const whereConditions: (SQL<unknown> | undefined)[] = [];
  if (startDate) {
    whereConditions.push(
      gte(tableSystemMetric.recordedAt, new Date(startDate).getTime() / 1000),
    );
  }
  if (endDate) {
    whereConditions.push(
      lte(tableSystemMetric.recordedAt, new Date(endDate).getTime() / 1000),
    );
  }
  let query = db
    .select({
      systemMetric: tableSystemMetric,
    })
    .from(tableSystemMetric);
  if (whereConditions.length > 0) {
    query = query.where(and(...whereConditions));
  }
  return query.all();
};
export const findSystemMetricsCount = async () => {
  const result = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(tableSystemMetric);
  return result[0]?.count ?? 0;
};
export const findSystemMetricsPaginated = async ({
  page = 1,
  pageSize = 50,
}: {
  page?: number;
  pageSize?: number;
}) => {
  const offset = (page - 1) * pageSize;
  let query = db
    .select({
      systemMetric: tableSystemMetric,
    })
    .from(tableSystemMetric)
    .limit(pageSize)
    .offset(offset)
    .orderBy(desc(tableSystemMetric.recordedAt));
  return query;
};
