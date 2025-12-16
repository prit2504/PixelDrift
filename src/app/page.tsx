// import type { Metadata } from "next";
// import HomePage from "@/components/HomepageClient"; // your current homepage

// export const metadata: Metadata = {
//   title: "PixelDrift — Free PDF, Image & AI Tools",
//   description:
//     "Compress images, convert files, remove backgrounds with AI, edit PDFs — all free, fast and secure. PixelDrift is a privacy-first online tool suite.",
//   keywords: [
//     "PDF tools",
//     "image tools",
//     "AI background remover",
//     "merge PDF",
//     "compress image",
//     "resize image",
//     "image converter",
//     "online tools",
//     "free pdf editor",
//     "pdf merger",
//   ],
//   openGraph: {
//     title: "PixelDrift — PDF, Image & AI Tools",
//     description:
//       "A free online workspace for PDF editing, image compression, conversions and powerful AI tools.",
//     url: "https://pixeldrift.online",
//     siteName: "PixelDrift",
//     images: [
//       {
//         url: "/logo.png",
//         width: 1200,
//         height: 630,
//         alt: "PixelDrift Tools Preview",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "PixelDrift — Free Online Tools",
//     description:
//       "Fast & secure PDF, image and AI utilities — all inside your browser.",
//     images: ["/logo.png"],
//   },
//   robots: {
//     index: true,
//     follow: true,
//     nocache: false,
//   },

// };

// export default function Page() {
//   return <HomePage />;
// }


import type { Metadata } from "next";
import HomeHero from "@/components/homepage/HomeHero";
import CategorySection from "@/components/homepage/CategorySection";
import USPSection from "@/components/homepage/USPSections";
import { TOOLS } from "@/components/homepage/tools";

export const metadata: Metadata = {
  title: "PixelDrift — Free PDF, Image & AI Tools",
  description:
    "Compress images, convert files, remove backgrounds with AI, edit PDFs — all free, fast and secure.",
  openGraph: {
    title: "PixelDrift — Free PDF, Image & AI Tools",
    description:
      "A free online workspace for PDF editing, image compression and conversions.",
    url: "https://pixeldrift.online",
    siteName: "PixelDrift",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "PixelDrift Tools Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelDrift — Free Online Tools",
    description:
      "Fast & secure PDF and image utilities — all inside your browser.",
    images: ["/logo.png"],
  },
};

export default function Page() {
  const pdfTools = TOOLS.filter((t) => t.category === "pdf").slice(0, 3);
  const imageTools = TOOLS.filter((t) => t.category === "image").slice(0, 3);

  return (
    <main className="py-8 md:py-12 px-4">
      <HomeHero />

      <CategorySection
        id="pdf-tools"
        title="PDF Tools"
        href="/tools/pdf"
        tools={pdfTools}
        color="blue"
      />

      <CategorySection
        id="image-tools"
        title="Image Tools"
        href="/tools/image"
        tools={imageTools}
        color="purple"
      />

      <USPSection />
    </main>
  );
}
