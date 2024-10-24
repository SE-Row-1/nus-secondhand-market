import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export function EditItemLink() {
  const { id: itemId } = useParams<{ id: string }>();

  return (
    <Button variant="secondary" asChild>
      <Link href={`/items/${itemId}/edit`}>
        <EditIcon className="size-4 mr-2" />
        Edit
      </Link>
    </Button>
  );
}
