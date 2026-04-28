import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whisky Journey",
  description: "好きだった一本から、次の一本に出会うウイスキーアプリ",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
