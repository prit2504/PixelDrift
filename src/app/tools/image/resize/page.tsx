import type { Metadata } from "next";
import ResizeNewPage from "./resizeImagePage";

export const metadata: Metadata = {
  title: "Resize Image | Smart Online Image Resizer – PixelDrift",
  description:
    "Resize images by custom width, height, or percentage. Use presets for social media, prevent upscaling, keep aspect ratio, sharpen output, and batch resize multiple images online.",
  keywords: [
    "resize image online",
    "free image resizer",
    "advanced image resize tool",
    "resize jpg",
    "resize png",
    "resize webp",
    "batch image resizer",
    "resize without losing quality",
    "sharpen image online",
    "PixelDrift image tools",
  ],
  openGraph: {
    title: "Resize Image (Advanced) | Smart Online Image Resizer – PixelDrift",
    description:
      "Resize images using presets or custom dimensions. Adjust percentage, format, sharpening, quality, and prevent upscaling — all online for free.",
    url: "https://pixeldrift.online/tools/image/resize",
    type: "website",
   
  },
  twitter: {
    card: "summary_large_image",
    title: "Resize Images Online – PixelDrift",
    description:
      "Powerful online image resizer with presets, aspect ratio control, sharpening, and batch resizing.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://pixeldrift.online/tools/image/resize",
  },
};

export default function Page() {
  return <ResizeNewPage />;
}
