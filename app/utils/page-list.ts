export const pageDescriptions: {
  description: string;
  path: string;
}[] = [
  {
    path: "_auth/_layout-default.tickets.index",
    description:
      'This page displays a data table of all maintenance tickets. Each row includes:\n  • Ticket ID\n  • Issue Description (truncated if lengthy)\n  • Priority (Low, Medium, High)\n  • Assigned Crew/Team\n  • Status (Open, In Progress, Completed)\n  • Date Created\n  • An Actions dropdown with "View Details" and "Edit"\nAbove the table, there is a "New Ticket" button that navigates the user to the ticket creation page. Users can filter the table by priority or assigned crew/team. When the user clicks "View Details" in the Actions dropdown, they load the ticket’s detail page. Clicking "Edit" navigates to the edit page for that ticket. This page ensures clear visibility and manageability of all existing tickets.\n',
  },
  {
    path: "_auth/_layout-default.tickets.new",
    description:
      'This page provides a form for creating a new maintenance ticket. The form includes:\n  • Issue Description (multi-line text area; required)\n  • Priority (dropdown with Low, Medium, High; required)\n  • Assigned Crew/Team (dropdown with valid crew/teams; required)\n  • Affected Systems (text input for listing relevant systems)\nThe user must fill out each required field before the "Save" button becomes enabled. Clicking "Save" creates the ticket and redirects the user to a view of the newly created ticket. A "Cancel" button discards any input and returns the user to the tickets list without creating a ticket.\n',
  },
  {
    path: "_auth/_layout-default.tickets.$ticketId.index",
    description:
      'This page shows a detailed view of a maintenance ticket, identified by its unique ticket ID. The page displays:\n  • Ticket ID\n  • Full Issue Description\n  • Priority (Low, Medium, High)\n  • Assigned Crew/Team\n  • Affected Systems\n  • Status (Open, In Progress, Completed)\n  • Date Created\nAn "Edit Ticket" button loads a form for updating any details of this ticket. A "Delete Ticket" button shows a confirmation dialog; confirming deletes the ticket and returns the user to the tickets list. This page ensures users can review all relevant details of the ticket at a glance and perform necessary actions.\n',
  },
  {
    path: "_auth/_layout-default.tickets.$ticketId.edit",
    description:
      'This page displays a pre-filled form for editing an existing maintenance ticket. The form includes:\n  • Issue Description (multi-line text area; required)\n  • Priority (dropdown with Low, Medium, High; required)\n  • Assigned Crew/Team (dropdown; required)\n  • Affected Systems (text input)\n  • Status (dropdown with Open, In Progress, Completed; required)\nThe form is populated with the current values. Updating any field and clicking "Save" applies the changes and navigates the user back to the detailed ticket view. A "Cancel" button discards changes and returns to the ticket detail view.\n',
  },
  {
    path: "_auth/_layout-default.system-observation._layout",
    description:
      'This route acts as a layout for observing the spaceship’s systems. It contains an Outlet where sub-routes are rendered. At the top of the layout, there are two navigation tabs:\n  • Real-Time\n  • Historical\nSelecting a tab loads the corresponding child route. A heading labeled "System Observation" is displayed. Users can seamlessly switch between real-time and historical data within this layout.\n',
  },
  {
    path: "_auth/_layout-default.system-observation._layout.index",
    description:
      "This page displays real-time monitoring information for the spaceship’s systems. It shows:\n  • Key system metrics such as life support, propulsion, and communications\n  • Alerts or anomalies flagged by onboard sensors\n  • Color-coded statuses indicating normal or abnormal conditions\nThe information refreshes periodically, allowing users to see the current state of all systems without manual reloads. There is a dedicated panel listing active alerts that require immediate attention. This page helps users quickly identify and respond to issues in real time.\n",
  },
  {
    path: "_auth/_layout-default.system-observation._layout.historical",
    description:
      "This page provides a historical view of system data. The layout includes:\n  • Graphs and charts displaying metrics (e.g., temperature, pressure, energy consumption) over a user-defined time range\n  • A table of past anomalies or alerts, with timestamps and relevant system details\n  • Date range filters that update the displayed data\nUsers analyze trends and identify recurring issues from a long-term perspective. This page enables informed decision-making by revealing patterns of system performance and maintenance history.\n",
  },
] as const;
