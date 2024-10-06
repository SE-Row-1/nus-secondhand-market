"use client";

import { useToast } from "@/hooks/use-toast";
import type { SingleItem } from "@/types";
import { ClientRequester } from "@/utils/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon, XIcon } from "lucide-react";
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
});

export function PublishItem() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const target = event.target as HTMLFormElement;
      const formData = Object.fromEntries(new FormData(target));

      const { name, description, price } = v.parse(formSchema, formData);

      return await new ClientRequester().post<SingleItem>("/items", {
        name,
        description,
        price,
        photo_urls: [],
      });
    },
    onSuccess: () => {
      setIsDialogOpen(false);

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
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              name="name"
              required
              placeholder="A short and sweet name"
              id="name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              required
              placeholder="Tell us more about your item"
              id="description"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="grow grid gap-2">
              <Label htmlFor="price">Price</Label>
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
