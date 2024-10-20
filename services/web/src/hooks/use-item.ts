import type { DetailedAccount, Item } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useQuery } from "@tanstack/react-query";

export function useItem(id: string, initialItem: Item<DetailedAccount>) {
  return useQuery({
    queryKey: ["items", id],
    queryFn: async () => {
      return await clientRequester.get<Item<DetailedAccount>>(`/items/${id}`);
    },
    initialData: initialItem,
  });
}
