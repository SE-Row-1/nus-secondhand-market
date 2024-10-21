"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { SingleItem } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon, UndoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import * as v from "valibot";
import { PhotoSelector } from "./photo-selector";

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
  photos: v.pipe(
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
    v.maxLength(5, "You can only upload up to 5 photos."),
  ),
});

export function PublishItemForm() {
  const [photoObjects, setPhotoObjects] = useState<
    { id: number; file: File; previewUrl: string }[]
  >([]);

  const router = useRouter();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const target = event.target as HTMLFormElement;
      const formData = Object.fromEntries(new FormData(target));

      const validFormData = v.parse(formSchema, {
        ...formData,
        photos: photoObjects.map(({ file }) => file),
      });

      const data = new FormData();
      data.append("name", validFormData.name);
      data.append("description", validFormData.description);
      data.append("price", validFormData.price.toString());
      validFormData.photos.forEach((photo) => data.append("photos", photo));

      return await clientRequester.form<SingleItem>("/items", data);
    },
    onSuccess: () => {
      setPhotoObjects([]);

      queryClient.invalidateQueries({ queryKey: ["items"] });

      toast({
        title: "Item published",
        description: "Your item has been published successfully.",
      });

      router.push("/belongings");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to publish item",
        description: error.message,
      });
    },
  });

  const formRef = useRef<HTMLFormElement>(null);
  const reset = () => {
    formRef.current?.reset();
    setPhotoObjects([]);
  };

  return (
    <form
      ref={formRef}
      onSubmit={mutate}
      className="grow flex flex-col justify-center items-stretch gap-4 w-full max-w-lg mx-auto"
    >
      <div className="grid gap-2">
        <Label showRequiredMarker htmlFor="name">
          Name
        </Label>
        <Input
          type="text"
          name="name"
          required
          placeholder="A short and sweet name"
          id="name"
        />
      </div>
      <div className="grid gap-2">
        <Label showRequiredMarker htmlFor="description">
          Description
        </Label>
        <Textarea
          name="description"
          required
          placeholder="Tell us more about your item"
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
            placeholder="0.00"
            required
            id="price"
          />
        </div>
        <div className="grid gap-2 w-20">
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
      <PhotoSelector
        photoObjects={photoObjects}
        setPhotoObjects={setPhotoObjects}
      />
      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
        <Button variant="secondary" onClick={reset}>
          <UndoIcon className="size-4 mr-2" />
          Reset
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2Icon className="size-4 mr-2 animate-spin" />
          ) : (
            <PlusIcon className="size-4 mr-2" />
          )}
          Publish
        </Button>
      </div>
    </form>
  );
}
