import { useToast } from "@/components/ui/use-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type Dispatch, type SetStateAction } from "react";
import { AddPhotoInput } from "./add-photo-input";
import { PhotoSlot } from "./photo-slot";

type Props = {
  photos: { url: string; file?: File }[];
  setPhotos: Dispatch<SetStateAction<{ url: string; file?: File }[]>>;
};

export function PhotoSlots({ photos, setPhotos }: Props) {
  const { toast } = useToast();

  const addPhotos = (files: File[]) => {
    setPhotos((photos) => {
      const newPhotos = [];

      for (const file of files) {
        if (photos.length + newPhotos.length >= 5) {
          break;
        }

        if (file.size > 1024 * 1024 * 5) {
          toast({
            variant: "destructive",
            title: "Photo size exceeds 5MB",
            description: `"${file.name}" (${Math.floor((file.size * 10) / 1024 / 1024) / 10}MB) is too big for us to handle. 🥲 Please select another smaller one.`,
          });
          continue;
        }

        newPhotos.push({ url: URL.createObjectURL(file), file: file });
      }

      return [...newPhotos, ...photos];
    });
  };

  const removePhoto = (url: string) => {
    setPhotos((photos) => photos.filter((photo) => photo.url !== url));
  };

  const [photoListRef] = useAutoAnimate();

  return (
    <ul
      ref={photoListRef}
      className="flex gap-2 pb-2 overflow-x-auto snap-x scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted"
    >
      <li className="shrink-0 size-24 sm:size-36 lg:size-48 snap-start">
        <AddPhotoInput addPhotos={addPhotos} />
      </li>
      {photos.map((photo) => (
        <li
          key={photo.url}
          className="shrink-0 size-24 sm:size-36 lg:size-48 snap-start"
        >
          <PhotoSlot
            url={photo.url}
            removeSelf={() => removePhoto(photo.url)}
          />
        </li>
      ))}
    </ul>
  );
}
