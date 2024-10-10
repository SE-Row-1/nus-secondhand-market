import { Skeleton } from "@/components/ui/skeleton";

export function Loading() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border rounded-lg md:mt-4 bg-card">
      <Skeleton className="size-8 lg:size-10 rounded-full" />
      <div className="grow space-y-1">
        <Skeleton className="w-1/2 h-4 lg:h-5" />
        <Skeleton className="h-4 lg:h-5" />
      </div>
    </div>
  );
}
