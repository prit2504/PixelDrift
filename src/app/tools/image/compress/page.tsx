import type { Metadata } from "next";
import CompressImageAdvanced from "./CompressImageAdvanced";

export const metadata: Metadata = {
  title: "Advanced Image Compressor | Reduce Size Without Quality Loss – PixelDrift",
  description:
    "Compress images with adjustable quality, resize percentage, max dimensions, format conversion, and metadata control. Supports JPG, PNG, WebP.",
  keywords: [
    "compress image online",
    "image compressor",
    "advanced image compression",
    "resize image",
    "reduce image file size",
    "WebP compressor",
    "JPEG compressor",
    "PNG compressor",
    "lossless compression",
    "PixelDrift image tools",
  ],
  openGraph: {
    title: "Advanced Image Compressor | PixelDrift",
    description:
      "Optimize, resize, and compress images with full control over quality, resolution, and metadata.",
    url: "https://pixeldrift.online/tools/image/compress",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advanced Image Compressor | PixelDrift",
    description:
      "Compress and optimize images with full control over quality, resize, resolution, and metadata.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://pixeldrift.online/tools/image/compress",
  },
};

export default function Page() {
  return <CompressImageAdvanced />;
}
