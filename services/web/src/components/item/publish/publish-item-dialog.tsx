"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { PublishItemForm } from "./publish-item-form";

export function PublishItemDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
        <PublishItemForm closeDialog={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
