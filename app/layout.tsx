import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CBSE Class 6 NCERT Revision App",
  description: "Interactive CBSE Class 6 NCERT revision app for Science, Social Science, and Mathematics.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
