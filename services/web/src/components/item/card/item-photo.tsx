import { ShoppingBagIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  photoUrl: string | undefined;
};

export function ItemPhoto({ photoUrl }: Props) {
  if (!photoUrl) {
    return (
      <div className="grid place-items-center aspect-square bg-muted">
        <ShoppingBagIcon className="size-1/3 text-muted-foreground" />
        <span className="sr-only">No preview photo availble</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-square">
      <Image
        src={photoUrl}
        alt="A preview photo of this second-hand item"
        fill
        className="object-contain"
      />
    </div>
  );
}
