import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Props = {
  publishedAt: string;
};

export function ItemPublishedAt({ publishedAt }: Props) {
  return (
    <time
      dateTime={publishedAt}
      className="text-sm text-muted-foreground group-hover:text-foreground transition-colors"
    >
      {dayjs(publishedAt).fromNow()}
    </time>
  );
}
