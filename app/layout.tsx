import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Providers from "./providers";
import Banner from "@/components/Banner";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clario | Environmental Intelligence",
  description: "Advanced air quality monitoring and prediction platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-black overflow-hidden`}>
        <Providers>
          <div className="flex flex-col h-screen">
            <Banner />
            <main className="flex-1 overflow-y-auto pb-24 relative">
              {children}
            </main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
