// app/tools/image/convert/page.tsx
import type { Metadata } from "next";
import ImageConvertPage from "./ImageConvertPage";
import ImageConvertJsonLd from "./ImageConvertJsonLd";

export const metadata: Metadata = {
  title: "Image Converter Online – Convert JPG, PNG, WebP, TIFF | PixelDrift",
  description:
    "Convert images online to JPG, PNG, WebP or TIFF. Fast batch image converter with high-quality output. Free, secure & no signup.",
  keywords: [
    "image converter online",
    "convert image format",
    "jpg to png",
    "png to webp",
    "webp to jpg",
    "tiff image converter",
    "batch image converter",
    "PixelDrift",
  ],
  alternates: {
    canonical: "https://pixeldrift.online/tools/image/convert",
  },
  openGraph: {
    title: "Image Converter Online – PixelDrift",
    description:
      "Convert images to JPG, PNG, WebP or TIFF online. Free & fast batch image converter.",
    url: "https://pixeldrift.online/tools/image/convert",
    siteName: "PixelDrift",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Converter Online – PixelDrift",
    description:
      "Free online image converter for JPG, PNG, WebP & TIFF formats.",
  },
};

export default function Page() {
  return (
    <>
      <ImageConvertJsonLd />
      <ImageConvertPage />
    </>
  );
}
