import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Live Bubble - iMessage Overlay",
  description: "iMessage-style overlay for live streams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-transparent">
        {children}
      </body>
    </html>
  );
}
