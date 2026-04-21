import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whisky Scanner",
  description: "OCR-based whisky bottle candidate search MVP",
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
