import type { DetailedAccount, SingleItem } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useQuery } from "@tanstack/react-query";

export function useItem(id: string, initialItem: SingleItem<DetailedAccount>) {
  return useQuery({
    queryKey: ["items", id],
    queryFn: async () => {
      return await clientRequester.get<SingleItem<DetailedAccount>>(
        `/items/${id}`,
      );
    },
    initialData: initialItem,
  });
}
