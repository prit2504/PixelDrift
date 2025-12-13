import type { Metadata } from "next";
import ImageToPDFAdvanced from "./ImageToPdfPage";

export const metadata: Metadata = {
  title: "Image to PDF  | Convert JPG, PNG, WebP to PDF – PixelDrift",
  description:
    "Convert images to a high-quality PDF with advanced layout controls: page size, margins, DPI, orientation, background color, fit modes, and drag-to-reorder. Fast, secure & free.",
  keywords: [
    "image to pdf",
    "convert images to pdf",
    "jpg to pdf",
    "png to pdf",
    "webp to pdf",
    "image to pdf converter online",
    "high quality image to pdf",
    "a4 pdf image converter",
    "pixel image to pdf",
    "advanced image to pdf tool",
    "batch image to pdf",
    "pixel drift image tools"
  ],
  openGraph: {
    title: "Image to PDF  | Professional Image-to-PDF Converter – PixelDrift",
    description:
      "Convert multiple images to a perfectly formatted PDF. Customize margins, DPI, orientation, layout style, background color, and fit mode.",
    url: "https://pixeldrift.online/tools/pdf/image-to-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to PDF – PixelDrift",
    description:
      "Convert JPG, PNG, WebP images into a polished PDF with custom sizes, margins, DPI, alignment, and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://pixeldrift.online/tools/pdf/image-to-pdf",
  },
};

export default function Page() {
  return <ImageToPDFAdvanced/>;
}
