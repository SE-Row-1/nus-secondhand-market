"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export function PageTitle() {
  const pathname = usePathname();

  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(document.title.replace(" | NUS Second-Hand Market", ""));
  }, [pathname]);

  if (!title) {
    return <Skeleton className="w-20 h-6 rounded-md" />;
  }

  return <h1>{title}</h1>;
}
