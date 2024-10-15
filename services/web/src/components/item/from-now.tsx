"use client";

import { useIsMounted } from "@/hooks/use-is-mounted";
import { fromNow } from "@/utils/datetime";

type Props = {
  date: string;
};

export function FromNow({ date }: Props) {
  const isMounted = useIsMounted();

  return <time dateTime={date}>{isMounted && fromNow(date)}</time>;
}
