import { ItemStatus } from "@/types";
import { Badge } from "../ui/badge";

type Props = {
  status: ItemStatus;
};

export function StatusBadge({ status }: Props) {
  switch (status) {
    case ItemStatus.ForSale:
      return (
        <Badge className="bg-green-600 hover:bg-green-600/80">FOR SALE</Badge>
      );
    case ItemStatus.Dealt:
      return (
        <Badge className="bg-yellow-600 hover:bg-yellow-600/80">DEALT</Badge>
      );
    case ItemStatus.Sold:
      return <Badge className="bg-red-600 hover:bg-red-600/80">SOLD</Badge>;
  }
}
