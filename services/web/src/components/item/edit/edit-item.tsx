"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import type { DetailedAccount, SingleItem } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, SaveIcon, UndoIcon } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import * as v from "valibot";
import { PhotoSlots } from "./photo-slots";

const formSchema = v.object({
  name: v.pipe(
    v.string("Name should be a string"),
    v.minLength(1, "Name should be at least 1 character long"),
    v.maxLength(50, "Name should be at most 50 characters long"),
  ),
  description: v.pipe(
    v.string("Description should be a string"),
    v.minLength(1, "Description should be at least 1 character long"),
    v.maxLength(500, "Description should be at most 500 characters long"),
  ),
  price: v.pipe(
    v.unknown(),
    v.transform(Number),
    v.number("Price should be a number"),
    v.minValue(0, "Price should be at least 0"),
  ),
  addedPhotos: v.pipe(
    v.array(
      v.pipe(
        v.file("Not a file"),
        v.mimeType(
          ["image/jpeg", "image/png", "image/webp", "image/avif"],
          "Unsupported image format",
        ),
        v.maxSize(5 * 1024 * 1024, "Image size should not exceed 5MB"),
      ),
    ),
    v.maxLength(5, "You can only upload up to 5 photos"),
  ),
  removedPhotoUrls: v.pipe(
    v.array(v.pipe(v.string("URL should be a string"), v.url("Invalid URL"))),
    v.maxLength(5, "You can only remove up to 5 photos"),
  ),
});

type Props = {
  id: string;
  initialItem: SingleItem<DetailedAccount>;
};

type Photo = { url: string; file?: File };

export function EditItem({ id, initialItem }: Props) {
  const { data: item } = useQuery({
    queryKey: ["items", id],
    queryFn: async () => {
      return await clientRequester.get<SingleItem<DetailedAccount>>(
        `/items/${id}`,
      );
    },
    initialData: initialItem,
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const target = event.target as HTMLFormElement;
      const formData = Object.fromEntries(new FormData(target));

      const addedPhotos = photos
        .filter((photo) => !item.photo_urls.includes(photo.url))
        .map((photo) => photo.file);

      const removedPhotoUrls = item.photo_urls.filter(
        (url) => !photos.some((photo) => photo.url === url),
      );

      const validFormData = v.parse(formSchema, {
        ...formData,
        addedPhotos,
        removedPhotoUrls,
      });

      const data = new FormData();
      data.append("name", validFormData.name);
      data.append("description", validFormData.description);
      data.append("price", validFormData.price.toString());
      validFormData.addedPhotos.forEach((photo) =>
        data.append("added_photos", photo),
      );
      validFormData.removedPhotoUrls.forEach((url) =>
        data.append("removed_photo_urls", url),
      );

      return await clientRequester.patchForm<SingleItem>(`/items/${id}`, data);
    },
    onSuccess: (item) => {
      queryClient.setQueryData(["items", id], item);

      toast({
        title: "Update success",
        description: "Your item has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    },
  });

  const [photos, setPhotos] = useState<Photo[]>(
    item.photo_urls.map((url) => ({ url })),
  );

  return (
    <form onSubmit={mutate} className="grid gap-4">
      <div className="grid gap-2">
        <Label showRequiredMarker htmlFor="name">
          Name
        </Label>
        <Input
          type="text"
          name="name"
          defaultValue={item.name}
          placeholder="A short and descriptive name"
          required
          minLength={1}
          maxLength={50}
          id="name"
        />
      </div>
      <div className="grid gap-2">
        <Label showRequiredMarker htmlFor="description">
          Description
        </Label>
        <Textarea
          name="description"
          defaultValue={item.description}
          placeholder="Tell us more about your item"
          required
          minLength={1}
          maxLength={500}
          id="description"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="grow grid gap-2">
          <Label showRequiredMarker htmlFor="price">
            Price
          </Label>
          <Input
            type="number"
            name="price"
            defaultValue={item.price}
            placeholder="0.00"
            required
            min={0}
            id="price"
          />
        </div>
        <div className="grid gap-2 w-32">
          <Label htmlFor="currency">Currency</Label>
          <Input
            type="text"
            name="currency"
            value="SGD"
            readOnly
            disabled
            required
            id="currency"
          />
        </div>
      </div>
      <div className="grid gap-3">
        <Label>Photos</Label>
        <PhotoSlots photos={photos} setPhotos={setPhotos} />
      </div>
      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 pt-2">
        <Button type="submit" disabled={isPending} className="sm:order-2">
          {isPending ? (
            <Loader2Icon className="size-4 mr-2 animate-spin" />
          ) : (
            <SaveIcon className="size-4 mr-2" />
          )}
          Save
        </Button>
        <Button variant="secondary" className="sm:order-1" asChild>
          <Link href={`/items/${id}`}>
            <UndoIcon className="size-4 mr-2" />
            Cancel
          </Link>
        </Button>
      </div>
    </form>
  );
}
