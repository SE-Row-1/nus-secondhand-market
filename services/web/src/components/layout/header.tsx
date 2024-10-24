import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { PageTitle } from "./page-title";

export function Header() {
  return (
    <header className="flex items-center h-[72px] p-6">
      <SidebarTrigger className="size-4 mr-3" />
      <Separator orientation="vertical" className="mr-4" />
      <PageTitle />
    </header>
  );
}
