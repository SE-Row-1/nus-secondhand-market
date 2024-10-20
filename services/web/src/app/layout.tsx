import { Header, Sidebar } from "@/components/layout";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/contexts/query-provider";
import type { Metadata } from "next";
import { Nunito as FontSans } from "next/font/google";
import type { PropsWithChildren } from "react";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={fontSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const storedTheme = localStorage.getItem("theme");
              const isDarkSystem = matchMedia("(prefers-color-scheme: dark)").matches;
              if (storedTheme === "dark" || (!storedTheme && isDarkSystem)) {
                document.documentElement.classList.add("dark");
              }
            `,
          }}
        ></script>
      </head>
      <body className="bg-background font-sans text-foreground antialiased scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted">
        <QueryProvider>
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <div className="md:hidden">
            <Header />
          </div>
          <div className="md:pl-56 lg:pl-72 pt-14 md:pt-0">
            <main className="flex flex-col min-h-[calc(100vh-56px)] md:min-h-screen px-6 md:px-12 lg:px-24 py-8 md:py-16">
              {children}
            </main>
          </div>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    template: "%s | NUS Second-Hand Market",
    default: "NUS Second-Hand Market",
  },
  description:
    "Built by NUS students and for NUS students. Buy and sell second-hand items on the platform, find your counterparty, and communicate efficiently.",
};
