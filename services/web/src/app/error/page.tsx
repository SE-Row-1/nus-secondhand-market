"use client";

import { Button } from "@/components/ui/button";
import { CircleXIcon, HouseIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="grow flex flex-col justify-center items-center gap-4">
      <CircleXIcon className="size-24" />
      <h1 className="font-bold text-3xl">Error occurred</h1>
      <p className="text-muted-foreground text-center text-balance">
        {message ?? "No message provided"}
      </p>
      <Button asChild>
        <Link href="/">
          <HouseIcon className="size-4 mr-2" />
          Take me home
        </Link>
      </Button>
    </div>
  );
}
