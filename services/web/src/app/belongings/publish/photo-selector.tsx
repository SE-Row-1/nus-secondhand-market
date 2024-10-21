import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PlusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, type Dispatch, type SetStateAction } from "react";

type Props = {
  photoObjects: { id: number; file: File; previewUrl: string }[];
  setPhotoObjects: Dispatch<
    SetStateAction<{ id: number; file: File; previewUrl: string }[]>
  >;
};

export function PhotoSelector({ photoObjects, setPhotoObjects }: Props) {
  const [photoListRef] = useAutoAnimate();

  const { toast } = useToast();

  const removePhotoObject = (id: number) => {
    setPhotoObjects((photoObjects) =>
      photoObjects.filter((photoObject) => photoObject.id !== id),
    );
  };

  const handleSelectPhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const newPhotos = event.target.files;

    if (!newPhotos || newPhotos.length === 0) {
      return;
    }

    const nextPhotoObjects = [...photoObjects];

    for (const newPhoto of Array.from(newPhotos)) {
      if (nextPhotoObjects.length >= 5) {
        break;
      }

      if (newPhoto.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Photo size exceeds 5MB",
          description: `"${newPhoto.name}" (${Math.floor((newPhoto.size * 10) / 1024 / 1024) / 10}MB) is too big for us to handle. 🥲 Please select another smaller one.`,
        });
        continue;
      }

      nextPhotoObjects.push({
        id: Math.random(),
        file: newPhoto,
        previewUrl: URL.createObjectURL(newPhoto),
      });
    }

    setPhotoObjects(nextPhotoObjects);
  };

  return (
    <div className="grid gap-2">
      <Label>
        Photos&nbsp;
        <span className="text-muted-foreground">({photoObjects.length}/5)</span>
      </Label>
      <div
        ref={photoListRef}
        className="flex gap-2 pb-2 overflow-x-auto snap-x scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted"
      >
        {photoObjects.map(({ id, previewUrl }) => (
          <div
            key={previewUrl}
            className="group shrink-0 relative size-24 snap-start"
          >
            <Image
              src={previewUrl}
              alt=""
              fill
              className="rounded-md object-cover group-hover:brightness-50 transition"
            />
            <button
              type="button"
              onClick={() => removePhotoObject(id)}
              className="grid place-items-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XIcon className="size-1/3" />
              <span className="sr-only">Remove this photo</span>
            </button>
          </div>
        ))}
        {photoObjects.length < 5 && (
          <Label
            htmlFor="photos"
            tabIndex={0}
            className="shrink-0 grid place-items-center size-24 rounded-md border hover:bg-muted/40 text-muted-foreground transition-colors cursor-pointer snap-start"
          >
            <PlusIcon className="size-1/2" />
            <span className="sr-only">Upload a photo of this item</span>
          </Label>
        )}
        <input
          type="file"
          name="photos"
          accept="image/jpeg, image/png, image/webp, image/avif"
          multiple
          onChange={handleSelectPhotos}
          className="hidden"
          id="photos"
        />
      </div>
    </div>
  );
}
