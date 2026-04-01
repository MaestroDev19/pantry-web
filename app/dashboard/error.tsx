"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { TypographyH2, TypographyP } from "@/components/ui/typography";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-start gap-4 py-12">
      <TypographyH2>Something went wrong</TypographyH2>
      <TypographyP className="text-muted-foreground text-sm max-w-md">
        This page could not be loaded. You can try again, or return to the home
        page if the problem continues.
      </TypographyP>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href="/dashboard">Dashboard</a>
        </Button>
      </div>
    </div>
  );
}
