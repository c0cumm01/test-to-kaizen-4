import { queryOptions } from "@tanstack/react-query";

import { $listCrewTeams } from "@/server/functions/crew-team";

export const crewTeamKeys = {
  all: () => [{ scope: "crewTeams" }] as const,
};
export const crewTeamsListOptions = () =>
  queryOptions({
    queryKey: crewTeamKeys.all(),
    queryFn: async () => {
      const response = await $listCrewTeams();
      return response;
    },
  });
export const crewTeamListOptions = () =>
  queryOptions({
    queryKey: crewTeamKeys.all(),
    queryFn: async () => {
      const response = await $listCrewTeams();
      return response;
    },
  });
