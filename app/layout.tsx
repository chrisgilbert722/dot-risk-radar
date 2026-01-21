import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DOT Risk Radar",
  description: "Public DOT inspection patterns translated into plain English. Monitor your operation's safety posture with ongoing analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
