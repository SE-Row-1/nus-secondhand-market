"use client";

import { useToast } from "@/hooks/use-toast";
import type { SingleItem } from "@/types";
import { ClientRequester } from "@/utils/requester/client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import * as v from "valibot";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const formSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
  description: v.pipe(v.string(), v.minLength(1), v.maxLength(500)),
  price: v.pipe(v.string(), v.transform(Number), v.minValue(0.01)),
  photos: v.pipe(
    v.array(
      v.pipe(
        v.file(),
        v.mimeType(["image/jpeg", "image/png", "image/webp", "image/avif"]),
        v.maxSize(1024 * 1024 * 5, "Photo size should not exceed 5MB."),
      ),
    ),
    v.maxLength(5, "You can only upload up to 5 photos."),
  ),
});

export function PublishItem() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [photoObjects, setPhotoObjects] = useState<
    { id: number; file: File; previewUrl: string }[]
  >([]);

  const removePhotoObject = (id: number) =>
    setPhotoObjects((photoObjects) =>
      photoObjects.filter((photoObject) => photoObject.id !== id),
    );

  const [photoListRef] = useAutoAnimate();

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

      return await new ClientRequester().postForm<SingleItem>("/items", data);
    },
    onSuccess: () => {
      setIsDialogOpen(false);
      setPhotoObjects([]);

      queryClient.invalidateQueries({ queryKey: ["items"] });

      toast({
        title: "Item published",
        description: "Your item has been published successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to publish item",
        description: error.message,
      });
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4 mr-2" />
          Publish
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish an item</DialogTitle>
          <DialogDescription>
            Got something you no longer need? Publish it here and let others
            know!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={mutate} className="grid gap-4 mt-1">
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
                disabled
                required
                id="currency"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Photos</Label>
            <div
              ref={photoListRef}
              className="flex gap-2 pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-thumb-rounded-md snap-x"
            >
              {photoObjects.map(({ id, previewUrl }) => (
                <div
                  key={previewUrl}
                  className="group shrink-0 relative snap-start"
                >
                  <Image
                    src={previewUrl}
                    alt=""
                    width={96}
                    height={96}
                    className="size-24 rounded-md object-cover group-hover:brightness-50 transition"
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
              <Label
                htmlFor="photos"
                tabIndex={0}
                className="shrink-0 grid place-items-center size-24 rounded-md border hover:bg-muted/40 text-muted-foreground transition-colors cursor-pointer snap-start"
              >
                <PlusIcon className="size-1/2" />
                <span className="sr-only">Upload a photo of this item</span>
              </Label>
            </div>
            <input
              type="file"
              name="photos"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              onChange={(event) =>
                setPhotoObjects((photoObjects) => [
                  ...photoObjects,
                  ...[...(event.target.files ?? [])].map((file) => ({
                    id: Math.random(),
                    file,
                    previewUrl: URL.createObjectURL(file),
                  })),
                ])
              }
              className="hidden"
              id="photos"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                <XIcon className="size-4 mr-2" />
                Close
              </Button>
            </DialogClose>
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <Loader2Icon className="size-4 mr-2 animate-spin" />
              ) : (
                <PlusIcon className="size-4 mr-2" />
              )}
              Publish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
