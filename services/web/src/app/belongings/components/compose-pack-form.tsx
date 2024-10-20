import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { ItemPack } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BoxesIcon, Loader2Icon, XIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import * as v from "valibot";
import { BelongingsSelect } from "./belongings-select";

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
  discount: v.pipe(
    v.unknown(),
    v.transform(Number),
    v.number("Discount should be a number"),
    v.minValue(0, "Discount should be at least 0%"),
    v.maxValue(100, "Discount should be at most 100%"),
  ),
  childrenIds: v.pipe(
    v.array(
      v.pipe(
        v.string("Item ID should be a string"),
        v.uuid("Item ID should be a UUID"),
      ),
      "Children IDs should be an array",
    ),
    v.minLength(2, "Select at least 2 items to compose a pack"),
  ),
});

type Props = {
  closeDialog: () => void;
};

export function ComposePackForm({ closeDialog }: Props) {
  const [childrenIds, setChildrenIds] = useState<string[]>([]);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { name, description, discount } = await v.parseAsync(formSchema, {
        ...Object.fromEntries(new FormData(event.target as HTMLFormElement)),
        childrenIds,
      });

      return await clientRequester.post<ItemPack>("/items/packs", {
        name,
        description,
        discount: discount / 100,
        children_ids: childrenIds,
      });
    },
    onSuccess: () => {
      closeDialog();

      queryClient.invalidateQueries({ queryKey: ["items"] });

      toast({
        title: "Pack composed",
        description: "An item pack has been composed successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to compose the pack",
        description: error.message,
      });
    },
  });

  return (
    <form onSubmit={mutate} className="grid gap-4">
      <div className="grid gap-2">
        <Label showRequiredMarker htmlFor="name">
          Name
        </Label>
        <Input
          type="text"
          name="name"
          required
          placeholder="A short and concise name"
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
      <div className="grid gap-2">
        <Label htmlFor="discount">Discount</Label>
        <div className="flex items-center gap-2">
          -
          <Input
            name="discount"
            defaultValue={0}
            placeholder="0"
            required
            pattern="\d*"
            className="max-w-16"
            id="discount"
          />
          %
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="childrenIds">Contained items</Label>
        <BelongingsSelect onValueChange={setChildrenIds} />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">
            <XIcon className="size-4 mr-2" />
            Close
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2Icon className="size-4 mr-2 animate-spin" />
          ) : (
            <BoxesIcon className="size-4 mr-2" />
          )}
          Compose
        </Button>
      </DialogFooter>
    </form>
  );
}
