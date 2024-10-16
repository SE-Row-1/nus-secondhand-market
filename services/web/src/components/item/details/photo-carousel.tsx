import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ShoppingBagIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  photoUrls: string[];
};

export function PhotoCarousel({ photoUrls }: Props) {
  if (photoUrls.length === 0) {
    return (
      <div className="grid place-items-center min-h-72 p-8 rounded-lg mx-auto bg-muted">
        <div className="flex justify-center items-center flex-wrap gap-4">
          <ShoppingBagIcon className="size-12 sm:size-16 text-muted-foreground" />
          <span className="sm:text-lg text-muted-foreground text-center">
            No preview availble
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-16">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {photoUrls.map((photoUrl) => (
            <CarouselItem key={photoUrl}>
              <div className="max-w-72 aspect-square rounded-lg mx-auto overflow-hidden">
                <Image
                  src={photoUrl}
                  alt="Photo of this item"
                  width={288}
                  height={288}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
