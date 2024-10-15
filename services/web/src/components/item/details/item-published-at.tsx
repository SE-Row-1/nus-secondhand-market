"use client";

import { useIsMounted } from "@/hooks/use-is-mounted";
import { fromNow } from "@/utils/datetime";

type Props = {
  publishedAt: string;
};

export function ItemPublishedAt({ publishedAt }: Props) {
  const isMounted = useIsMounted();

  return (
    <time dateTime={publishedAt}>{isMounted && fromNow(publishedAt)}</time>
  );
}
