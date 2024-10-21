import { SidebarMenuItem } from "@/components/ui/sidebar";
import { prefetchMe } from "@/prefetchers";
import { JoinNowCard } from "./join-now-card";
import { MeCardClient } from "./me-card.client";

export async function MeCardServer() {
  const { data: me, error: meError } = await prefetchMe();

  if (meError) {
    return (
      <SidebarMenuItem>
        <JoinNowCard />
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <MeCardClient initialMe={me} noAuthFallback={<JoinNowCard />} />
    </SidebarMenuItem>
  );
}
