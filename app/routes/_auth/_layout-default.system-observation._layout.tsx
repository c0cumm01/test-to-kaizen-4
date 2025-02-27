import * as React from "react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute(
  "/_auth/_layout-default/system-observation/_layout",
)({
  component: SystemObservationLayout,
});
function SystemObservationLayout() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">System Observation</h1>
      <div className="flex space-x-4">
        <Button variant="link" asChild>
          <Link to="/system-observation">Real-Time</Link>
        </Button>
        <Button variant="link" asChild>
          <Link to="/system-observation/historical">Historical</Link>
        </Button>
      </div>
      <Outlet />
    </div>
  );
}
