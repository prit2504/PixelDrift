// app/tools/pdf/merge/page.tsx
import type { Metadata } from "next";
import MergePDF from "./MergePDFPage";
import MergePDFJsonLd from "./MergePDFJsonLd";

export const metadata: Metadata = {
  title: "Merge PDF Online – Combine Multiple PDFs into One | PixelDrift",
  description:
    "Merge multiple PDF files into a single document online. Reorder pages, preserve quality, and merge securely — free and no signup.",
  keywords: [
    "merge pdf online",
    "combine pdf files",
    "pdf merger",
    "join pdf",
    "merge multiple pdf into one",
    "secure pdf merge",
    "PixelDrift pdf tools",
  ],
  alternates: {
    canonical: "https://pixeldrift.online/tools/pdf/merge",
  },
  openGraph: {
    title: "Merge PDF Online – PixelDrift",
    description:
      "Combine multiple PDF files into one clean document. Fast, secure and free.",
    url: "https://pixeldrift.online/tools/pdf/merge",
    siteName: "PixelDrift",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Online – PixelDrift",
    description:
      "Free online tool to merge multiple PDFs into a single file.",
  },
};

export default function Page() {
  return (
    <>
      <MergePDFJsonLd />
      <MergePDF />
    </>
  );
}
