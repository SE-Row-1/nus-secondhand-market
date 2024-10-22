import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DetailedAccount } from "@/types";
import { MailIcon, MessageSquareMoreIcon, SendIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  seller: DetailedAccount;
  itemName: string;
};

export function ContactSellerButton({ seller, itemName }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <MessageSquareMoreIcon className="size-4 mr-2" />
          Contact seller via...
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`mailto:${seller.email}`}>
            <MailIcon className="size-4 mr-2" />
            Email:&nbsp;
            <span className="text-muted-foreground">{seller.email}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!seller.phone_number} asChild>
          <Link
            href={`https://wa.me/${seller.phone_code}${seller.phone_number}?text=Hi! I'm interested in your "${itemName}" published on NUS Second-Hand market.`}
          >
            <SendIcon className="size-4 mr-2" />
            WhatsApp:&nbsp;
            <span className="text-muted-foreground">
              {seller.phone_number
                ? `+${seller.phone_code} ${seller.phone_number}`
                : "Not provided"}
            </span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
