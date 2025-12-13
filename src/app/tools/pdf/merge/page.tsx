import type { Metadata } from "next";
import MergePDF from "./MergePDFPage";

export const metadata: Metadata = {
  title: "Merge PDF Online | Combine Multiple PDFs into One – PixelDrift",
  description:
    "Merge multiple PDF files into a single clean document instantly. Secure, fast, and fully browser-based. No uploads stored. Free PDF merging by PixelDrift.",
  keywords: [
    "merge pdf",
    "combine pdf",

    "join pdf files",
    "pdf merger online",
    "free pdf merge tool",
    "merge pdf without losing quality",
    "pdf combiner",
    "merge multiple pdf into one",
    "online pdf merge",
    "pixel drift pdf tools",
    "secure pdf merger"
  ],
  openGraph: {
    title: "Merge PDF Online – Fast, Secure & Free | PixelDrift",
    description:
      "Combine multiple PDF files into one high-quality document. Works instantly in your browser with no file storage.",
    url: "https://pixeldrift.online/tools/pdf/merge",
    type: "website",
    
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Online – PixelDrift",
    description:
      "Free tool to combine multiple PDF files into a clean, single document. Fast & secure.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://pixeldrift.online/tools/pdf/merge",
  },
};

export default function Page() {
  return <MergePDF />;
}




