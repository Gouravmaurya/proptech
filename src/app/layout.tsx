import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { PropertyProvider } from "@/components/providers/PropertyProvider";
import NextTopLoader from "nextjs-toploader";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Haven | AI-Powered Real Estate Investment",
  description: "Discover, analyze, and invest in real estate with the power of AI. Get instant ROI projections, property analysis, and market insights.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-primary font-sans`}
      >
        <NextTopLoader color="#059669" showSpinner={false} />
        <SessionProvider>
          <PropertyProvider>
            {children}
          </PropertyProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
