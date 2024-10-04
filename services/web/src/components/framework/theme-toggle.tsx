"use client";

import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      <SunIcon className="hidden dark:block size-4" />
      <MoonIcon className="dark:hidden size-4" />
      <span>Toggle theme</span>
    </button>
  );
}

function toggleTheme() {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
}
