import { fromNow } from "@/utils/datetime";

type Props = {
  publishedAt: string;
};

export function ItemPublishedAt({ publishedAt }: Props) {
  return (
    <time
      dateTime={publishedAt}
      className="text-sm text-muted-foreground group-hover:text-foreground transition-colors"
    >
      {fromNow(publishedAt)}
    </time>
  );
}
