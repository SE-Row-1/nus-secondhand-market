import type { Account } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { HttpError } from "@/utils/requester/http-error";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch the current user.
 */
export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        return await clientRequester.get<Account>("/auth/me");
      } catch (error) {
        if (error instanceof HttpError && error.status === 401) {
          return null;
        }
        throw error;
      }
    },
  });
}
