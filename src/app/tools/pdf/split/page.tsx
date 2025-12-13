import type { Metadata } from "next";
import SplitAdvancedPDF from "./SplitPdfPage";

export const metadata: Metadata = {
  title: "Split PDF Online | Extract Pages or Ranges – PixelDrift",
  description:
    "Split PDF pages instantly by selecting page ranges or extracting individual pages. Fast, secure, no file storage. Free PDF splitter by PixelDrift.",
  keywords: [
    "split pdf",
    "extract pdf pages",
    "pdf splitter online",
    "separate pdf pages",
    "free pdf split tool",
    "split pdf into multiple files",
    "extract pages from pdf",
    "pdf page splitter",
    "pdf range splitter",
    "pixel drift pdf tools",
    "split pdf without losing quality"
  ],
  openGraph: {
    title: "Split PDF Online – Extract Pages or Ranges | PixelDrift",
    description:
      "Extract specific pages or page ranges from any PDF. 100% secure and fast — no upload stored.",
    url: "https://pixeldrift.online/tools/pdf/split",
    type: "website",
    
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF Online – PixelDrift",
    description:
      "Fast, secure tool to extract pages or split PDFs into multiple files.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://pixeldrift.online/tools/pdf/split",
  },
};

export default function Page() {
  return <SplitAdvancedPDF />;
}
