import { linkOptions } from "@tanstack/react-router";
import { Ticket, TicketPlus, Gauge, History } from "lucide-react";

export const navSections = [
  {
    title: "Tickets",
    icon: Ticket,
    items: [
      {
        title: "All Tickets",
        icon: Ticket,
        link: linkOptions({ to: "/tickets" }),
      },
      {
        title: "New Ticket",
        icon: TicketPlus,
        link: linkOptions({ to: "/tickets/new" }),
      },
    ],
  },
  {
    title: "System Observation",
    icon: Gauge,
    items: [
      {
        title: "Real-Time",
        icon: Gauge,
        link: linkOptions({ to: "/system-observation/" }),
      },
      {
        title: "Historical",
        icon: History,
        link: linkOptions({ to: "/system-observation/historical" }),
      },
    ],
  },
];