import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { ItemStatus, type Item } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCheckIcon,
  DollarSignIcon,
  HandshakeIcon,
  Loader2Icon,
  TagIcon,
} from "lucide-react";
import type { MouseEvent, PropsWithChildren } from "react";

export function UpdateStatusDropdownMenu({ children }: PropsWithChildren) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <TagIcon className="size-4 mr-2" />
          Mark as...
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}

type UpdateStatusActionProps = {
  itemId: string;
  to: ItemStatus;
};

export function UpdateStatusAction({ itemId, to }: UpdateStatusActionProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      return await clientRequester.put<Item>(`/items/${itemId}/status`, {
        status: to,
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["items", itemId], (item: Item) => ({
        ...item,
        status: to,
      }));
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: error.message,
      });
    },
  });
  return (
    <DropdownMenuItem asChild>
      <button
        type="button"
        disabled={isPending}
        onClick={mutate}
        className="w-full disabled:opacity-70"
      >
        {isPending ? (
          <Loader2Icon className="size-4 mr-2"></Loader2Icon>
        ) : (
          <StatusIcon status={to} />
        )}
        {getStatusText(to)}
      </button>
    </DropdownMenuItem>
  );
}

function StatusIcon({ status }: { status: ItemStatus }) {
  switch (status) {
    case ItemStatus.FOR_SALE:
      return <DollarSignIcon className="size-4 mr-2" />;
    case ItemStatus.DEALT:
      return <HandshakeIcon className="size-4 mr-2" />;
    case ItemStatus.SOLD:
      return <CheckCheckIcon className="size-4 mr-2" />;
  }
}

function getStatusText(status: ItemStatus) {
  switch (status) {
    case ItemStatus.FOR_SALE:
      return "For sale";
    case ItemStatus.DEALT:
      return "Dealt";
    case ItemStatus.SOLD:
      return "Sold";
  }
}
