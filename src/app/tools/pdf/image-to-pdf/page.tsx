// app/tools/pdf/image-to-pdf/page.tsx
import type { Metadata } from "next";
import ImageToPDFAdvanced from "./ImageToPdfPage";
import ImageToPDFJsonLd from "./ImageToPDFJsonLd";

export const metadata: Metadata = {
  title: "Image to PDF Online – Convert JPG, PNG & WebP to PDF | PixelDrift",
  description:
    "Convert images to a high-quality PDF online. Control page size, margins, DPI, orientation, layout and order. Free, secure & no signup.",
  keywords: [
    "image to pdf online",
    "convert images to pdf",
    "jpg to pdf",
    "png to pdf",
    "webp to pdf",
    "image to pdf converter",
    "batch image to pdf",
    "PixelDrift pdf tools",
  ],
  alternates: {
    canonical: "https://pixeldrift.online/tools/pdf/image-to-pdf",
  },
  openGraph: {
    title: "Image to PDF Online – PixelDrift",
    description:
      "Convert multiple images into a perfectly formatted PDF with full layout control.",
    url: "https://pixeldrift.online/tools/pdf/image-to-pdf",
    siteName: "PixelDrift",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to PDF Online – PixelDrift",
    description:
      "Convert JPG, PNG and WebP images into a clean, high-quality PDF.",
  },
};

export default function Page() {
  return (
    <>
      <ImageToPDFJsonLd />
      <ImageToPDFAdvanced />
    </>
  );
}
