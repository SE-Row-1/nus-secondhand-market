import { Header, Sidebar, ThemeInitializer } from "@/components/framework";
import { Toaster } from "@/components/ui/toaster";
import type { Account } from "@/types";
import { ServerRequester } from "@/utils/requester/server";
import type { Metadata } from "next";
import { Nunito as FontSans } from "next/font/google";
import type { PropsWithChildren } from "react";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | NUS Second-Hand Market",
    default: "NUS Second-Hand Market",
  },
  description:
    "Built by NUS students and for NUS students. Buy and sell second-hand items on the platform, find your counterparty, and communicate efficiently.",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const me = await new ServerRequester().get<Account | null>("/auth/me");

  return (
    <html lang="en" className={fontSans.variable} suppressHydrationWarning>
      <head>
        <ThemeInitializer />
      </head>
      <body className="bg-background font-sans text-foreground antialiased">
        <div className="hidden md:block">
          <Sidebar me={me} />
        </div>
        <div className="md:hidden">
          <Header me={me} />
        </div>
        <main className="md:pl-56 lg:pl-72 pt-16 md:pt-0">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
