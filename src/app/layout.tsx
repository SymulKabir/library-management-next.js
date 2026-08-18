import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "sass";
import { ToastContainer } from "react-toastify";
import StoreProvider from "./StoreProvider";
import SearchFeatureIntro from "@/src/components/SearchFeatureIntro";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Hive",
  description: "Digital Library management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
          {children}
          <ToastContainer />
           <SearchFeatureIntro/>
        </body>
      </html>
    </StoreProvider>
  );
}
