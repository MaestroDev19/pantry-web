"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";
  const checked = mounted ? isDark : false;

  return (
    <div className="flex items-center gap-2">
      <Switch
        aria-label="Toggle dark mode"
        checked={checked}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        thumbChildren={
          <>
            <Sun
              className="h-3 w-3 text-foreground opacity-100 transition-opacity group-data-[state=checked]/switch:opacity-0"
              aria-hidden="true"
            />
            <Moon
              className="absolute h-3 w-3 text-foreground opacity-0 transition-opacity group-data-[state=checked]/switch:opacity-100"
              aria-hidden="true"
            />
          </>
        }
      />
    </div>
  );
}
