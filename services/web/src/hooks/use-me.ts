import type { DetailedAccount } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { HttpError } from "@/utils/requester/http-error";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch the current user.
 */
export function useMe(initialMe?: DetailedAccount) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        return await clientRequester.get<DetailedAccount>("/auth/me");
      } catch (error) {
        if (error instanceof HttpError && error.status === 401) {
          return null;
        }
        throw error;
      }
    },
    initialData: initialMe,
  });
}
