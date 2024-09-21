import { Header, Sidebar, ThemeInitializer } from "@/components/framework";
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
        <ThemeInitializer />
      </head>
      <body>
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="md:hidden">
          <Header />
        </div>
        <main className="md:pl-56 lg:pl-72">{children}</main>
      </body>
    </html>
  );
}
