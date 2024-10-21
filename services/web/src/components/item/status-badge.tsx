import { ItemStatus } from "@/types";
import { Badge } from "../ui/badge";

type Props = {
  status: ItemStatus;
};

export function StatusBadge({ status }: Props) {
  switch (status) {
    case ItemStatus.FOR_SALE:
      return <Badge className="bg-green-600">FOR SALE</Badge>;
    case ItemStatus.DEALT:
      return <Badge className="bg-yellow-600">DEALT</Badge>;
    case ItemStatus.SOLD:
      return <Badge className="bg-red-600">SOLD</Badge>;
  }
}
