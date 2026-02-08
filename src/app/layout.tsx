import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DW ZIZI | Luxury Live Edge Oak Furniture",
  description:
    "Handcrafted live edge oak tables where nature becomes art. Each piece celebrates the raw beauty of ancient oak, transformed into functional sculptures for discerning spaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
