// app/tools/pdf/split/page.tsx
import type { Metadata } from "next";
import SplitAdvancedPDF from "./SplitPdfPage";
import SplitPDFJsonLd from "./SplitPDFJsonLd";

export const metadata: Metadata = {
  title: "Split PDF Online – Extract Pages or Ranges | PixelDrift",
  description:
    "Split PDF files online by extracting specific pages or ranges. Fast, secure, no signup, and no file storage.",
  keywords: [
    "split pdf online",
    "extract pdf pages",
    "pdf splitter",
    "separate pdf pages",
    "split pdf into files",
    "pdf range splitter",
    "PixelDrift pdf tools",
  ],
  alternates: {
    canonical: "https://pixeldrift.online/tools/pdf/split",
  },
  openGraph: {
    title: "Split PDF Online – PixelDrift",
    description:
      "Extract pages or page ranges from PDF files instantly and securely.",
    url: "https://pixeldrift.online/tools/pdf/split",
    siteName: "PixelDrift",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF Online – PixelDrift",
    description:
      "Free online tool to split PDFs by page range or individual pages.",
  },
};

export default function Page() {
  return (
    <>
      <SplitPDFJsonLd />
      <SplitAdvancedPDF />
    </>
  );
}
