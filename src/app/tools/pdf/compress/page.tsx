// app/tools/pdf/compress/page.tsx
import type { Metadata } from "next";
import CompressPDFAdvancedPage from "./CompressPDFPage";
import CompressPDFJsonLd from "./CompressPDFJsonLd";

export const metadata: Metadata = {
  title: "Compress PDF Online – High Quality PDF Compressor | PixelDrift",
  description:
    "Compress PDF files online with advanced controls. Reduce PDF size using DPI, image quality, grayscale and metadata removal. Free & secure.",
  keywords: [
    "compress pdf online",
    "pdf compressor",
    "reduce pdf size",
    "advanced pdf compression",
    "compress scanned pdf",
    "pdf dpi compression",
    "remove pdf metadata",
    "grayscale pdf",
    "PixelDrift pdf tools",
  ],
  alternates: {
    canonical: "https://pixeldrift.online/tools/pdf/compress",
  },
  openGraph: {
    title: "Compress PDF Online – PixelDrift",
    description:
      "Advanced PDF compressor with DPI, quality, grayscale and metadata controls.",
    url: "https://pixeldrift.online/tools/pdf/compress",
    siteName: "PixelDrift",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF Online – PixelDrift",
    description:
      "Reduce PDF size with high-quality compression. Free online PDF compressor.",
  },
};

export default function Page() {
  return (
    <>
      <CompressPDFJsonLd />
      <CompressPDFAdvancedPage />
    </>
  );
}
