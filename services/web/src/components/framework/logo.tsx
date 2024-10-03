import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 px-3 py-2 font-semibold">
      <Image
        src="/icon.svg"
        alt="Logo"
        width={24}
        height={24}
        className="size-6"
      />
      <span>NUS Market</span>
    </Link>
  );
}
