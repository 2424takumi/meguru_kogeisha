import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

import SiteHeader from "@/components/layout/SiteHeader";

const notoSans = Noto_Sans_JP({
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const notoSerif = Noto_Serif_JP({
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "めぐる工芸舎",
  description: "工芸の産地と人々をつなぐデジタル・コモンズ。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSans.variable} ${notoSerif.variable} bg-[--neu-50] text-[--neu-900] antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
