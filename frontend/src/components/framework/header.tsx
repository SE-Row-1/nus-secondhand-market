import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Logo } from "./logo";
import { Nav } from "./nav";
import { ThemeToggle } from "./theme-toggle";
import { UserCard } from "./user-card";

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 flex justify-center items-center py-2 border-b bg-background/80 backdrop-blur-lg z-10">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute left-2">
            <MenuIcon className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col border-r">
          <Logo />
          <Nav />
          <ThemeToggle />
          <UserCard user={{}} />
        </SheetContent>
      </Sheet>
      <Logo />
    </header>
  );
}
