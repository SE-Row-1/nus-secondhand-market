import { Button } from "@/components/ui/button";
import { CircleXIcon, HouseIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    message: string;
  }>;
};

export default async function ErrorPage({ searchParams }: Props) {
  const { message } = await searchParams;

  return (
    <div className="flex flex-col justify-center items-center gap-4 h-full">
      <CircleXIcon className="size-20" />
      <h1 className="font-bold text-3xl">Server-side error occurred</h1>
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

export const metadata: Metadata = {
  title: "Server-side Error",
};
