import { Button } from "@/components/ui/button";
import { CircleXIcon, HouseIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  searchParams: {
    message: string;
  };
};

export default function ErrorPage({ searchParams: { message } }: Props) {
  return (
    <div className="grow flex flex-col justify-center items-center gap-4">
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
