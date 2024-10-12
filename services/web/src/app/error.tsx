"use client";

import { Button } from "@/components/ui/button";
import { CircleXIcon, HouseIcon, RotateCwIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ error, reset }: Props) {
  useEffect(() => console.error(error), [error]);

  return (
    <div className="grow flex flex-col justify-center items-center gap-4">
      <CircleXIcon className="size-24" />
      <h1 className="font-bold text-3xl">Error occurred</h1>
      <p className="text-muted-foreground text-center text-balance">
        Seems like you&apos;ve run into an unexpected error. What about trying
        again?
      </p>
      {error.digest && (
        <p className="text-sm text-muted-foreground text-center text-balance">
          Digest: {error.digest}
        </p>
      )}
      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
        <Button variant="secondary" asChild>
          <Link href="/">
            <HouseIcon className="size-4 mr-2" />
            Take me home
          </Link>
        </Button>
        <Button onClick={reset}>
          <RotateCwIcon className="size-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
}
