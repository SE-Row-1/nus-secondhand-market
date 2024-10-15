"use client";

import { useIsMounted } from "@/hooks/use-is-mounted";
import { fromNow } from "@/utils/datetime";

type Props = {
  publishedAt: string;
};

export function ItemPublishedAt({ publishedAt }: Props) {
  const isMounted = useIsMounted();

  return (
    <time
      dateTime={publishedAt}
      className="text-sm text-muted-foreground group-hover:text-foreground transition-colors"
    >
      {isMounted && fromNow(publishedAt)}
    </time>
  );
}
