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
import type { DetailedAccount } from "@/types";
import { BoxesIcon } from "lucide-react";
import { useState } from "react";
import { ComposePackForm } from "./compose-pack-form";

type Props = {
  me: DetailedAccount;
};

export function ComposePackDialog({ me }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <BoxesIcon className="size-4 mr-2" />
          Compose
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compose an item pack</DialogTitle>
          <DialogDescription>
            Bundle your items together and sell them in one go!
          </DialogDescription>
        </DialogHeader>
        <ComposePackForm me={me} closeDialog={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
