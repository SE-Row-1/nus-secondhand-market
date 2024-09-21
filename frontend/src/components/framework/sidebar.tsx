import { Logo } from "./logo";
import { Nav } from "./nav";
import { ThemeToggle } from "./theme-toggle";

export function Sidebar() {
  return (
    <aside className="fixed left-0 inset-y-0 min-w-56 lg:min-w-72 flex flex-col p-2 lg:p-4 border-r bg-muted/40 z-10">
      <div className="pb-1 lg:pb-3 border-b">
        <Logo />
      </div>
      <Nav />
      <ThemeToggle />
    </aside>
  );
}
