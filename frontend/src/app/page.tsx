import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Marketplace | NUS Second-Hand Market",
};

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] grid place-items-center">
      <Button asChild>
        <Link
          href="https://github.com/SE-Row-1/nus-secondhand-market"
          target="_blank"
        >
          <GithubIcon className="size-4 mr-2" />
          Source code
        </Link>
      </Button>
    </div>
  );
}