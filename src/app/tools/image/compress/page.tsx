// app/tools/image/compress-advanced/page.tsx
import type { Metadata } from "next";
import CompressImageAdvanced from "./CompressImageAdvanced";
import ImageCompressorJsonLd from "./JsonLd";

export const metadata: Metadata = {
  title: "Advanced Image Compressor Online – Free JPG, PNG & WebP | PixelDrift",
  description:
    "Compress images online without quality loss. Reduce JPG, PNG & WebP image size instantly. Free, fast, secure & no signup.",
  keywords: [
    "compress image online",
    "image compressor",
    "reduce image size",
    "jpeg compressor",
    "png compressor",
    "webp image compression",
    "free image optimizer",
    "PixelDrift",
  ],
  alternates: {
    canonical: "https://pixeldrift.online/tools/image/compress",
  },
  openGraph: {
    title: "Advanced Image Compressor – PixelDrift",
    description:
      "Free online image compressor to reduce JPG, PNG & WebP file size without losing quality.",
    url: "https://pixeldrift.online/tools/image/compress",
    siteName: "PixelDrift",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <ImageCompressorJsonLd />
      <CompressImageAdvanced />
    </>
  );
}
