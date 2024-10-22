import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  itemId: string;
};

export function EditItemLink({ itemId }: Props) {
  return (
    <Button variant="secondary" asChild>
      <Link href={`/items/${itemId}/edit`}>
        <EditIcon className="size-4 mr-2" />
        Edit
      </Link>
    </Button>
  );
}
