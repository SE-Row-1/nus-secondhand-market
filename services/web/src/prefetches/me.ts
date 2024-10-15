import type { DetailedAccount } from "@/types";
import { serverRequester } from "@/utils/requester/server";
import { cache } from "react";

export const prefetchMe = cache(async () => {
  return await serverRequester.get<DetailedAccount>("/auth/me");
});
