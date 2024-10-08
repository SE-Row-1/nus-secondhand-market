import type { Account } from "@/types";
import { ClientRequester } from "@/utils/requester/client";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch the current user.
 */
export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      return await new ClientRequester().get<Account>("/auth/me");
    },
    retry: false,
  });
}
