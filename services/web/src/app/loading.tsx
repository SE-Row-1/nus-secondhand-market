import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="grow grid place-items-center">
      <Loader2Icon className="size-16 animate-spin" />
    </div>
  );
}
