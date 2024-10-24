import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useItem } from "@/query/browser";
import { MailIcon, MessageSquareMoreIcon, SendIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export function ContactSellerButton() {
  const { id: itemId } = useParams<{ id: string }>();

  const { data: item } = useItem(itemId);

  if (!item) {
    return null;
  }

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
          <Link href={`mailto:${item.seller.email}`} target="_blank">
            <MailIcon className="size-4 mr-2" />
            Email:&nbsp;{item.seller.email}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!item.seller.phone_number} asChild>
          <Link
            href={`https://wa.me/${item.seller.phone_code}${item.seller.phone_number}?text=Hi! I'm interested in your "${item.name}" published on NUS Second-Hand market.`}
            target="_blank"
          >
            <SendIcon className="size-4 mr-2" />
            WhatsApp:&nbsp;
            {item.seller.phone_number
              ? `+${item.seller.phone_code} ${item.seller.phone_number}`
              : "Not provided"}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
