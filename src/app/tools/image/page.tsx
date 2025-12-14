"use client";

import ToolCard from "@/components/ToolCard";
import Link from "next/link";
import { Gauge, Wand2, Image as ImageIcon } from "lucide-react";

/* ============================================================
   IMAGE TOOLS LIST
============================================================ */
const imageTools = [
  {
    id: "compress-image",
    title: "Compress Image",
    description: "Reduce image size while keeping crisp visual quality.",
    href: "/tools/image/compress",
    icon: Gauge,
    tag: "Image",
    category: "image",
  },
  {
    id: "Image resize",
    title: "Image Resize)",
    description:
      "Set quality, resize %, max dimensions, format conversion & metadata options.",
    href: "/tools/image/resize",
    icon: Wand2,
    tag: "Advanced",
    category: "image",
  },
  {
    id: "image-converter",
    title: "Image Converter",
    description: "Convert images to JPG, PNG, WebP and more instantly.",
    href: "/tools/image/convert",
    icon: ImageIcon,
    tag: "Converter",
    category: "image",
  },
];

/* ============================================================
   IMAGE TOOLS PAGE
============================================================ */
export default function ImageToolsPage() {
  return (
    <main
      className="py-10 px-4 mx-auto"
      aria-labelledby="image-tools-title"
    >
      {/* ---------------------- */}
      {/* Back Navigation */}
      {/* ---------------------- */}
      <nav aria-label="breadcrumb">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          ← Back to Home
        </Link>
      </nav>

      {/* ---------------------- */}
      {/* Header Section */}
      {/* ---------------------- */}
      <header className="mb-10">
        <h1
          id="image-tools-title"
          className="text-4xl font-bold mb-3 flex items-center gap-2"
        >
          Image Tools
        </h1>

        <p className="text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
          Compress, resize, convert and optimize images quickly and securely —
          with processing done directly in your browser for maximum privacy.
        </p>
      </header>

      {/* ---------------------- */}
      {/* Tools Grid */}
      {/* ---------------------- */}
      <section
        aria-label="Available Image Tools"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {imageTools.map((tool) => (
            <ToolCard {...tool} key={tool.id} aria-label={tool.title}/>
      
        ))}
      </section>

      <div className="h-10 md:h-16" />
    </main>
  );
}
