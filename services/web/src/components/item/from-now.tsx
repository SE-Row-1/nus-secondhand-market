"use client";

import { useIsMounted } from "@/hooks/use-is-mounted";
import { fromNow } from "@/utils/datetime";

type Props = {
  date: string;
  className?: string;
};

export function FromNow({ date, className = "" }: Props) {
  const isMounted = useIsMounted();

  return (
    <time dateTime={date} className={className}>
      {isMounted && fromNow(date)}
    </time>
  );
}
