import { db } from "@/server/db/connection";
import { tableCrewTeam } from "@/server/db/schema";

export const findCrewTeams = async () => {
  const crewTeams = await db
    .select({
      crewTeamId: tableCrewTeam.crewTeamId,
      name: tableCrewTeam.name,
    })
    .from(tableCrewTeam);
  return crewTeams;
};
