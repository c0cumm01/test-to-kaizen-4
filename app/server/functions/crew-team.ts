import { createServerFn } from "@tanstack/start";

import { authMiddleware } from "@/middleware/auth";
import { findCrewTeams } from "@/server/db/queries/crew-team/read";

export const $listCrewTeams = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const crewTeams = await findCrewTeams();
    return { crewTeams };
  });
