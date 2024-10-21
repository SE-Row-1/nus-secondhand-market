import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import type { ChangeEvent } from "react";

type Props = {
  addPhotos: (files: File[]) => void;
};

export function AddPhotoInput({ addPhotos }: Props) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    addPhotos([...files]);
  };

  return (
    <>
      <Label
        htmlFor="photos"
        tabIndex={0}
        className="grid place-items-center h-full rounded-md border hover:bg-muted/50 text-muted-foreground transition-colors cursor-pointer"
      >
        <PlusIcon className="size-1/3" />
        <span className="sr-only">Upload a photo of this item</span>
      </Label>
      <input
        type="file"
        name="photos"
        accept="image/jpeg, image/png, image/webp, image/avif"
        multiple
        onChange={handleChange}
        className="hidden"
        id="photos"
      />
    </>
  );
}
