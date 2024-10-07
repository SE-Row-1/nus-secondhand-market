import {
  HeartIcon,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
  ShoppingBagIcon,
} from "lucide-react";
import { NavLink } from "./nav-link";

export function Nav() {
  return (
    <nav className="grow flex flex-col gap-0.5 lg:gap-1 py-3 lg:py-4 font-medium text-sm">
      <NavLink href="/">
        <ShoppingBagIcon className="size-4" />
        Marketplace
      </NavLink>
      <NavLink href="/search">
        <SearchIcon className="size-4" />
        Search
      </NavLink>
      <NavLink href="#">
        <HeartIcon className="size-4" />
        My wishlist
      </NavLink>
      <NavLink href="/belongings">
        <PackageIcon className="size-4" />
        My belongings
      </NavLink>
      <NavLink href="/settings">
        <SettingsIcon className="size-4" />
        Settings
      </NavLink>
    </nav>
  );
}
