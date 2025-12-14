
import type { Metadata } from "next";
import { Suspense } from "react"; // ✅ ADD THIS
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import GlobalPageLoader from "@/components/GlobalPageLoader";

export const metadata: Metadata = {
  metadataBase: new URL("https://pixeldrift.online"), 

  title: {
    default: "PixelDrift — PDF, Image & AI Tools",
    template: "%s | PixelDrift",
  },
  other: {
    "google-site-verification":
      "googlee32d5da59eac3ee4",
  },
  verification: {
    google : "Z4Lp6kljxAXPQ4JlvGwaJYPtiKN_bZp9X6WukReXHLw",
  },
  description:
    "PixelDrift offers fast, secure and mobile-friendly tools to merge, split, compress, convert and enhance PDF & Image files — plus AI-powered background removal.",

  keywords: [
    "PDF tools",
    "merge PDF",
    "split PDF",
    "compress PDF",
    "image tools",
    "compress image",
    "resize image",
    "convert image",
    "AI background remover",
    "online file tools",
    "PixelDrift",
    "free PDF tools",
    "free image tools",
  ],

  authors: [{ name: "PixelDrift Team" }],
  creator: "PixelDrift",
  publisher: "PixelDrift",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  alternates: {
    canonical: "https://pixeldrift.online",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pixeldrift.online",
    siteName: "PixelDrift",
    title: "PixelDrift — PDF, Image & AI Tools",
    description:
      "Fast, secure and privacy-friendly PDF, Image & AI tools. No signup. No file storage. Instant processing.",
    images: [
      {
        url: "/logo.png", 
        width: 1200,
        height: 630,
        alt: "PixelDrift — Online PDF & Image Tools",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "PixelDrift — PDF, Image & AI Tools",
    description:
      "Free, fast and secure tools to edit PDFs, compress images, convert formats and use AI background remover.",
    images: ["/logo.png"],
    creator: "@pixeldrift",
  },

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gray-50 text-gray-900 dark:bg-neutral-900 dark:text-gray-100">

        {/* ✅ FIX: Suspense boundary */}
        <Suspense fallback={null}>
          <GlobalPageLoader />
        </Suspense>

        {/* Navigation bar */}
        <Navbar />

        <div className="fixed inset-0 -z-10 bg-grid-pattern pointer-events-none" />

        <main className="pt-20 pb-24">
          <div className="container mx-auto px-4">{children}</div>
        </main>

        {/* Footer */}
        <Footer />

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </body>
    </html>
  );
}
