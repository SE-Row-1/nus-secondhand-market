import type { Account } from "@/types";
import { ServerRequester } from "@/utils/requester/server";
import { JoinNowCard } from "./join-now-card";
import { MeCardClient } from "./me-card-client";

export async function MeCardServer() {
  const me = await new ServerRequester().get<Account | undefined>("auth/me");

  return <MeCardClient initialMe={me} fallback={<JoinNowCard />} />;
}
