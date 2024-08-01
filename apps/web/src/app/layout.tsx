import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

import AuthProvider from "@/components/providers/auth.provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Farm2Door",
  description: "Fresh Online Groceries",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(GeistSans.className, "overscroll-none")}>
        <AuthProvider>
          {children}
          <Toaster richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
