"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export function ThemeToggle() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={handleClick}>
        <SunIcon className="hidden dark:block" />
        <MoonIcon className="dark:hidden" />
        <span>Toggle theme</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function handleClick() {
  const isDark = document.documentElement.classList.toggle("dark");

  localStorage.setItem("theme", isDark ? "dark" : "light");

  document.documentElement.classList.add("disable-transitions");
  setTimeout(() => {
    document.documentElement.classList.remove("disable-transitions");
  }, 1);
}
