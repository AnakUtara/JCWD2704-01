import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/providers/auth.provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Farm2Door",
  description: "Fresh Online Groceries",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
