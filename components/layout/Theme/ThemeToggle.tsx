"use client";

import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="cursor-pointer">
      <HugeiconsIcon icon={Sun01Icon} className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <HugeiconsIcon icon={Moon01Icon} className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
