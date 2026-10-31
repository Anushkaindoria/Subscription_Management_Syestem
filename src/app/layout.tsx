import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "LoopOS | Subscription Management & Billing",
  description: "Modular Monolith Subscription Engine & Billing Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-background text-text-main font-sans">
        {children}
        {/* Toast Container Anchor */}
        <div id="toast-root" style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999 }} />
      </body>
    </html>
  );
}
