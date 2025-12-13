import type { Metadata } from "next";
import HomePage from "@/components/HomepageClient"; // your current homepage

export const metadata: Metadata = {
  title: "PixelDrift — Free PDF, Image & AI Tools",
  description:
    "Compress images, convert files, remove backgrounds with AI, edit PDFs — all free, fast and secure. PixelDrift is a privacy-first online tool suite.",
  keywords: [
    "PDF tools",
    "image tools",
    "AI background remover",
    "merge PDF",
    "compress image",
    "resize image",
    "image converter",
    "online tools",
    "free pdf editor",
    "pdf merger",
  ],
  openGraph: {
    title: "PixelDrift — PDF, Image & AI Tools",
    description:
      "A free online workspace for PDF editing, image compression, conversions and powerful AI tools.",
    url: "https://pixeldrift.online",
    siteName: "PixelDrift",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "PixelDrift Tools Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelDrift — Free Online Tools",
    description:
      "Fast & secure PDF, image and AI utilities — all inside your browser.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },

};

export default function Page() {
  return <HomePage />;
}
