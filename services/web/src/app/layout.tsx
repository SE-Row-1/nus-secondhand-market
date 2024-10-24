import { Header, Sidebar } from "@/components/layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/query/provider";
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
      <body className="bg-background font-sans text-foreground antialiased">
        <QueryProvider>
          <SidebarProvider>
            <Sidebar />
            <SidebarInset>
              <Header />
              <div className="h-[calc(100vh-72px)] px-6 pb-16 overflow-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
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
