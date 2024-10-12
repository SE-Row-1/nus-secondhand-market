"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchBar() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const debouncedQ = useDebounce(q);

  const router = useRouter();

  useEffect(() => {
    router.push(`/search?${debouncedQ ? `q=${debouncedQ}` : ""}`);
  }, [router, debouncedQ]);

  return (
    <div
      className={cn(
        "space-y-8 w-[clamp(256px,100%,512px)] mx-auto mb-8 transition-transform",
        debouncedQ || "translate-y-[30vh]",
      )}
    >
      <h1 className="flex justify-center items-center font-bold text-3xl">
        <SearchIcon className="size-8 mr-3" />
        Search
      </h1>
      <Input
        type="search"
        name="q"
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="What are you interested in today?"
        required
        maxLength={100}
        autoFocus
      />
    </div>
  );
}
