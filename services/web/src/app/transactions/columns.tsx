"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/components/ui/utils";
import type { SimplifiedAccount, Transaction } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { CopyIcon, MoreHorizontalIcon, PackageIcon } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<Transaction>[] = [
  {
    header: "Item",
    accessorKey: "item.name",
  },
  {
    header: "Seller",
    accessorKey: "seller",
    cell: ({ getValue }) => {
      const seller = getValue<SimplifiedAccount>();

      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src={seller.avatar_url ?? undefined} alt="Avatar" />
            <AvatarFallback>{seller.nickname?.[0] ?? "S"}</AvatarFallback>
          </Avatar>
          <span>{seller.nickname ?? "Anonymous"}</span>
        </div>
      );
    },
  },
  {
    header: "Buyer",
    accessorKey: "buyer",
    cell: ({ getValue }) => {
      const buyer = getValue<SimplifiedAccount>();

      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src={buyer.avatar_url ?? undefined} alt="Avatar" />
            <AvatarFallback>{buyer.nickname?.[0] ?? "A"}</AvatarFallback>
          </Avatar>
          <span>{buyer.nickname ?? "Anonymous"}</span>
        </div>
      );
    },
  },
  {
    header: "Price",
    accessorKey: "item.price",
  },
  {
    header: "Created at",
    accessorKey: "created_at",
    cell: ({ getValue }) => {
      const date = new Date(getValue<string>());

      return <time dateTime={date.toISOString()}>{date.toLocaleString()}</time>;
    },
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const { text, date, classNames } = row.original.completed_at
        ? {
            text: "Completed",
            date: new Date(row.original.completed_at),
            classNames: "bg-green-600",
          }
        : row.original.cancelled_at
          ? {
              text: "Cancelled",
              date: new Date(row.original.cancelled_at),
              classNames: "bg-red-600",
            }
          : {
              text: "Pending",
              date: null,
              classNames: "bg-yellow-600",
            };

      return (
        <div className="flex items-center gap-2">
          <div className={cn("size-2 rounded-full", classNames)}></div>
          <span>
            {text}&nbsp;
            {date && (
              <>
                at&nbsp;
                <time dateTime={date.toISOString()}>
                  {date.toLocaleString()}
                </time>
              </>
            )}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(row.original.id)}
              >
                <CopyIcon className="size-4 mr-2" />
                Copy transaction ID
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/items/${row.original.item.id}`}>
                <PackageIcon className="size-4 mr-2" />
                View item
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
