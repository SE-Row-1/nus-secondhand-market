import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Logo } from "./logo";
import { MeCard } from "./me-card";
import { Nav } from "./nav";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 flex justify-center items-center py-2 border-b bg-background z-20">
      <Logo />
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute left-2">
            <MenuIcon className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col border-r">
          <SheetHeader className="hidden">
            <SheetTitle>Navigation menu</SheetTitle>
            <SheetDescription>
              Navigation menu on mobile screen
            </SheetDescription>
          </SheetHeader>
          <Logo />
          <Nav />
          <ThemeToggle />
          <MeCard />
        </SheetContent>
      </Sheet>
    </header>
  );
}
