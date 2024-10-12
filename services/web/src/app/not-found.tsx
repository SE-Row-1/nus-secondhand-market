import { Button } from "@/components/ui/button";
import { HouseIcon, MapPinXInsideIcon } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 min-h-[calc(100vh-88px)]">
      <MapPinXInsideIcon className="size-24" />
      <h1 className="font-bold text-3xl">Page not found</h1>
      <p className="text-muted-foreground text-center text-balance">
        Oops! The page you&apos;re looking for does not exist. Let&apos;s get
        you back on track!
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
