import type { Metadata } from "next";
import ImageConvertPage from "./ImageConvertPage";

export const metadata: Metadata = {
  title: "Image Converter | Convert JPG, PNG, WebP, BMP, TIFF – PixelDrift",
  description:
    "Free online image converter to convert JPG, PNG, WebP, BMP, and TIFF. Supports batch conversion, renaming, and high-quality output.",
  keywords: [
    "image converter",
    "convert image online",
    "jpg to png",
    "png to webp",
    "webp to jpg",
    "bmp converter",
    "tiff converter",
    "batch image converter",
    "free image tools",
    "PixelDrift image converter",
  ],
  openGraph: {
    title: "Image Converter | Convert JPG, PNG, WebP, BMP, TIFF – PixelDrift",
    description:
      "Convert multiple images between JPG, PNG, WebP, BMP, and TIFF formats. Fast, free, and secure batch conversion.",
    url: "https://pixeldrift.online/tools/image/convert",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Converter | PixelDrift",
    description:
      "Convert images to JPG, PNG, WebP, BMP, or TIFF. Supports batch conversion & renaming.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://pixeldrift.online/tools/image/convert",
  },
};

export default function Page() {
  return <ImageConvertPage />;
}
