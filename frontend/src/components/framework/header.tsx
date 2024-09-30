import type { Account } from "@/types";
import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { JoinNowCard } from "./join-now-card";
import { Logo } from "./logo";
import { Nav } from "./nav";
import { ThemeToggle } from "./theme-toggle";
import { UserCard } from "./user-card";

type Props = {
  me: Account | null;
};

export function Header({ me }: Props) {
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
          <UserCard initialAccount={me} fallback={<JoinNowCard />} />
        </SheetContent>
      </Sheet>
      <Logo />
    </header>
  );
}
