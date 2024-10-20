import { JoinNowCard } from "./join-now-card";
import { LoadingCard } from "./loading-card";
import { MeCardClient } from "./me-card-client";

export async function MeCardServer() {
  return (
    <MeCardClient
      loadingFallback={<LoadingCard />}
      noAuthFallback={<JoinNowCard />}
    />
  );
}
