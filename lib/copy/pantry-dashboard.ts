interface PantryDashboardStatsCopy {
  totalItems: string
  runningLow: string
  expiringSoon: string
  outOfStock: string
}

interface PantryDashboardSectionsCopy {
  expiringSoon: string
  recentActivity: string
}

export interface PantryDashboardCopy {
  title: string
  subtitle: string
  stats: PantryDashboardStatsCopy
  sections: PantryDashboardSectionsCopy
}

export const PANTRY_DASHBOARD_COPY: PantryDashboardCopy = {
  title: "Pantry overview",
  subtitle: "Here is a quick snapshot of what is in your pantry right now.",
  stats: {
    totalItems: "Total items",
    runningLow: "Running low",
    expiringSoon: "Expiring soon",
    outOfStock: "Out of stock",
  },
  sections: {
    expiringSoon: "Expiring soon",
    recentActivity: "Recent activity",
  },
}

