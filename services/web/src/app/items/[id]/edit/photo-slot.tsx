import { XIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  url: string;
  removeSelf?: () => void;
};

export function PhotoSlot({ url, removeSelf = () => {} }: Props) {
  return (
    <div className="group relative h-full rounded-md overflow-hidden">
      <Image
        src={url}
        alt=""
        width={96}
        height={96}
        className="size-full group-hover:brightness-50 transition"
      />
      <button
        type="button"
        onClick={removeSelf}
        className="grid place-items-center absolute inset-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <XIcon className="size-1/3" />
        <span className="sr-only">Remove this photo</span>
      </button>
    </div>
  );
}
