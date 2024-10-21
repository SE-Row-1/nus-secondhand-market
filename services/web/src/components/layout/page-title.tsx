"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTitle() {
  const pathname = usePathname();

  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(document.title.replace(" | NUS Second-Hand Market", ""));
  }, [pathname]);

  return <h1>{title}</h1>;
}
