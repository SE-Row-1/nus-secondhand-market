import { JoinNowCard } from "./join-now-card";
import { Loading } from "./loading";
import { MeCardClient } from "./me-card-client";

export async function MeCardServer() {
  return (
    <MeCardClient
      loadingFallback={<Loading />}
      noAuthFallback={<JoinNowCard />}
    />
  );
}
