// app/tools/image/resize/page.tsx
import type { Metadata } from "next";
import ResizeImagePage from "./resizeImagePage";
import ResizeImageJsonLd from "./ResizeImageJsonLd";

export const metadata: Metadata = {
  title: "Resize Image Online – Free JPG, PNG & WebP Resizer | PixelDrift",
  description:
    "Resize images online by width, height or presets. Resize JPG, PNG & WebP images without losing quality. Free, fast & secure.",
  keywords: [
    "resize image online",
    "image resizer",
    "resize jpg",
    "resize png",
    "resize webp",
    "batch image resizer",
    "social media image resize",
    "PixelDrift",
  ],
  alternates: {
    canonical: "https://pixeldrift.online/tools/image/resize",
  },
  openGraph: {
    title: "Resize Image Online – PixelDrift",
    description:
      "Resize images using presets or custom dimensions. Free online image resizer.",
    url: "https://pixeldrift.online/tools/image/resize",
    siteName: "PixelDrift",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resize Images Online – PixelDrift",
    description:
      "Free online image resizer with presets, aspect ratio control and batch resizing.",
  },
};

export default function Page() {
  return (
    <>
      <ResizeImageJsonLd />
      <ResizeImagePage/>
    </>
  );
}
