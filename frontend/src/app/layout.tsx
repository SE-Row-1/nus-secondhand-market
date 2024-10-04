import { Header, Sidebar, ThemeInitializer } from "@/components/framework";
import { Toaster } from "@/components/ui/toaster";
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

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={fontSans.variable} suppressHydrationWarning>
      <head>
        <ThemeInitializer />
      </head>
      <body className="bg-background font-sans text-foreground antialiased">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="md:hidden">
          <Header />
        </div>
        <main className="md:pl-56 lg:pl-72 pt-16 md:pt-0">
          <div className="px-6 md:px-12 lg:px-24 py-4 md:py-8">{children}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
