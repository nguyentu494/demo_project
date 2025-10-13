import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import { WalletSessionSync } from "@/components/CheckWalletSession";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Commerce Dashboard",
  description: "Simple dashboard using DummyJSON API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Header />
      {/* <WalletSessionSync /> */}
      <div className="w-full bg-white">
        <main className="container mx-auto min-h-screen bg-white">
          {children}
        </main>
      </div>
    </>
  );
}
