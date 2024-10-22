import { prefetchItemTransaction } from "@/prefetchers";
import type { SimplifiedAccount } from "@/types";
import { WantersClient } from "./wanters.client";

type Props = {
  itemId: string;
  wanters: SimplifiedAccount[];
};

export async function WantersServer({ itemId, wanters }: Props) {
  const { data: itemTransaction, error } =
    await prefetchItemTransaction(itemId);

  if (error) {
    console.error(error);
    return null;
  }

  const buyer = itemTransaction?.[0]?.buyer;

  return <WantersClient itemId={itemId} wanters={wanters} buyer={buyer} />;
}
