"use client";

import ToolCard from "@/components/ToolCard";
import Link from "next/link";
import {
  FileText,
  Scissors,
  FileDown,
  Image as ImageIcon,
} from "lucide-react";

/* ============================================================
   PDF TOOLS LIST
============================================================ */
const pdfTools = [
  {
    id: "merge-pdf",
    title: "Merge PDF",
    description: "Combine multiple PDF files into one organized document.",
    href: "/tools/pdf/merge",
    icon: FileText,
    tag: "PDF",
    category: "pdf",
  },
  {
    id: "split-pdf",
    title: "Split PDF",
    description: "Extract selected pages or ranges into a new PDF.",
    href: "/tools/pdf/split",
    icon: Scissors,
    tag: "PDF",
    category: "pdf",
  },
  {
    id: "compress-pdf-adv",
    title: "Compress PDF",
    description:
      "Reduce PDF size using DPI, render quality, and optimization settings.",
    href: "/tools/pdf/compress",
    icon: FileDown,
    tag: "Advanced",
    category: "pdf",
  },
  {
    id: "image-to-pdf",
    title: "Image to PDF",
    description: "Convert images into a clean, high-quality PDF instantly.",
    href: "/tools/pdf/image-to-pdf",
    icon: ImageIcon,
    tag: "PDF & Image",
    category: "pdf",
  },
];

/* ============================================================
   PDF TOOLS PAGE
============================================================ */
export default function PDFToolsPage() {
  return (
    <main
      className="py-10 px-4 mx-auto"
      aria-labelledby="pdf-tools-title"
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
      {/* Page Header */}
      {/* ---------------------- */}
      <header className="mb-10">
        <h1
          id="pdf-tools-title"
          className="text-4xl font-bold mb-4 tracking-tight"
        >
          PDF Tools
        </h1>

        <p className="text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
          A complete suite of PDF utilities — merge, split, compress, and
          convert images to PDF.  
          All tools are browser-based, secure, and completely free.
        </p>
      </header>

      {/* ---------------------- */}
      {/* Tools Section */}
      {/* ---------------------- */}
      <section
        aria-label="Available PDF Tools"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {pdfTools.map((tool) => (
            <ToolCard {...tool}  key={tool.id} aria-label={tool.title}/>
        ))}
      </section>

      <div className="h-10 md:h-16" />
    </main>
  );
}
