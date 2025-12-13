import type { Metadata } from "next";
import CompressPDFAdvancedPage from "./CompressPDFPage";

export const metadata: Metadata = {
  title: "Compress PDF (Advanced) | High-Quality PDF Compressor – PixelDrift",
  description:
    "Compress PDFs using advanced controls: DPI, image quality, grayscale mode, metadata removal, and page-limit compression. Achieve small file sizes with excellent clarity — free & secure.",
  keywords: [
    "compress pdf",
    "advanced pdf compressor",
    "reduce pdf size online",
    "pdf compression tool",
    "compress scanned pdf",
    "high quality pdf compression",
    "pdf dpi compression",
    "remove pdf metadata",
    "pdf grayscale converter",
    "PixelDrift pdf tools",
  ],
  openGraph: {
    title: "Compress PDF | High-Quality PDF Compressor – PixelDrift",
    description:
      "Fine-tune your PDF compression with DPI settings, grayscale, metadata stripping, quality control, and page-limit options.",
    url: "https://pixeldrift.online/tools/pdf/compress",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF – PixelDrift",
    description:
      "Advanced PDF compression with DPI, grayscale, metadata removal, and high-quality optimization.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://pixeldrift.online/tools/pdf/compress",
  },
};

export default function Page() {
  return  <CompressPDFAdvancedPage />;
}
