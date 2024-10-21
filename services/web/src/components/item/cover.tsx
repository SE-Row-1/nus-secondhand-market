import { ShoppingBagIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  photoUrls: string[];
};

export function Cover({ photoUrls }: Props) {
  if (!photoUrls[0]) {
    return (
      <div className="grid place-items-center aspect-square rounded-t-lg bg-muted">
        <ShoppingBagIcon className="size-1/3 text-muted-foreground" />
        <span className="sr-only">No preview availble</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-square rounded-t-lg overflow-hidden">
      <Image
        src={photoUrls[0]}
        alt="A preview photo of this second-hand item"
        fill
        sizes="100vw, (min-width: 540px) 50vw, (min-width: 720px) 33vw, (min-width: 768px) 50vw, (min-width: 1024px) 33vw, (min-width: 1280px) 25vw, (min-width: 1536px) 20vw"
        className="object-contain"
      />
      {photoUrls.length >= 2 && (
        <div className="absolute right-0 bottom-0 px-3 py-1.5 rounded-tl-lg bg-card group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          +{photoUrls.length - 1} photos
        </div>
      )}
    </div>
  );
}
