import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  HeartIcon,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
  ShoppingBagIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MeCard } from "./me-card";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="gap-3" asChild>
              <Link href="/">
                <Image
                  src="/icon.svg"
                  alt="Logo"
                  width={24}
                  height={24}
                  className="size-6"
                />
                <span className="font-semibold text-base">NSHM</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavLink icon={<ShoppingBagIcon />} title="Marketplace" to="/" />
              <NavLink icon={<SearchIcon />} title="Search" to="/search" />
              <NavLink
                icon={<PackageIcon />}
                title="Belongings"
                to="/belongings"
              />
              <NavLink icon={<HeartIcon />} title="Wishlist" to="/wishlist" />
              <NavLink
                icon={<SettingsIcon />}
                title="Settings"
                to="/settings"
                subLinks={[
                  { title: "Account", to: "/settings" },
                  { title: "Display", to: "/settings/display" },
                  { title: "Contacts", to: "/settings/contacts" },
                ]}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <ThemeToggle />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <MeCard />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}