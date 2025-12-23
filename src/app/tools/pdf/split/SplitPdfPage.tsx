"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import ToolLayout from "@/components/ToolLayout";
import { motion } from "framer-motion";

export default function SplitAdvancedPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState("all");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (selected: FileList | null) => {
    if (!selected?.length) return;

    const f = selected[0];
    if (f.type !== "application/pdf") return toast.error("Only PDF files allowed.");

    setFile(f);
  };

  const handleDragDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const splitPDF = async () => {
    if (!file) return toast.error("Please upload a PDF.");

    setLoading(true);
    toast.loading("Splitting PDF...", { id: "split" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        "/api/pdf/split",
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "extracted_pages.pdf";
      a.click();

      toast.success("PDF split successfully!", { id: "split" });
    } catch {
      toast.error("Error splitting PDF.", { id: "split" });
    }

    setLoading(false);
  };

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract specific pages or custom ranges and download them as a clean, new PDF."
      sidebarCategory="pdf"
    >
      <h1 className="sr-only">
        Split PDF Online – Extract Pages Securely
      </h1>

      {/* PREMIUM UPLOAD BOX */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        
        className="cursor-pointer rounded-2xl p-10 text-center border-2 border-dashed
             border-neutral-200 dark:border-neutral-800
             bg-white dark:bg-neutral-900 hover:border-blue-500 transition"
      >
        <UploadCloud className="mx-auto h-12 w-12 mb-3 text-blue-600" />
        <p className="text-neutral-600 dark:text-neutral-400">
          Drag & drop PDF files or click to upload
        </p>
        

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* FILE CARD */}
      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            mt-8 p-4 rounded-2xl shadow-sm border
            bg-white/90 dark:bg-neutral-800/70
            backdrop-blur border-gray-200 dark:border-neutral-700
          "
        >
          <p className="font-medium text-sm truncate">{file.name}</p>
          <p className="text-xs text-gray-500 mt-1">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </motion.div>
      )}

      {/* PAGE RANGE INPUT (Premium) */}
      <div className="mt-12 max-w-md">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Page range
        </label>

        <input
          type="text"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          placeholder='e.g., "1-3, 5, 9-12" or "all"'
          className="
            w-full rounded-xl px-4 py-2.5 text-sm
            bg-gray-50 dark:bg-neutral-900
            border border-gray-300 dark:border-neutral-700
            focus:ring-2 focus:ring-blue-500 transition
          "
        />

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          • Use <b>all</b> to extract everything.<br />
          • Use <b>1-3</b> for a page range.<br />
          • Use <b>1, 5, 7-10</b> for multiple ranges.
        </p>
      </div>

      {/* ACTION BUTTON */}
      <div className="mt-12 flex flex-col items-center">
        <button
          onClick={splitPDF}
          disabled={!file || loading}
          className="
            px-7 py-3 rounded-xl font-medium shadow-md
            bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
            text-white flex items-center gap-2
            transition active:scale-95
          "
        >
          <FileText size={18} />
          {loading ? "Splitting..." : "Split PDF"}
        </button>

        {/* PROGRESS BAR */}
        {loading && (
          <div className="mt-4 h-2 w-full max-w-md bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 animate-[progress_1.2s_linear_infinite]" />
          </div>
        )}
      </div>
      <section className="mt-24 border-t pt-16">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* HEADER */}
          <header className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Split PDF Files Online with Precision
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Extract exactly the pages you need from any PDF — fast, accurate,
              and without quality loss.
            </p>
          </header>

          {/* FEATURE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
              <h3 className="font-bold text-xl mb-3">
                Flexible Page Ranges
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                Extract single pages, continuous ranges, or multiple ranges like
                <code> 1-3, 6, 9-12</code> with full control.
              </p>
            </div>

            <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
              <h3 className="font-bold text-xl mb-3">
                No Quality Loss
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                Pages are extracted without recompression, preserving original text,
                layout, and image quality.
              </p>
            </div>

            <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
              <h3 className="font-bold text-xl mb-3">
                Fast & Browser-Based
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                Split PDFs instantly in your browser without installing software
                or creating an account.
              </p>
            </div>

            <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
              <h3 className="font-bold text-xl mb-3">
                Secure & Private
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                Files are processed securely and never stored. Everything is deleted
                immediately after splitting.
              </p>
            </div>
          </div>

          {/* SEO CONTENT */}
          <article className="prose prose-neutral dark:prose-invert max-w-none bg-neutral-50 dark:bg-neutral-900 p-10 rounded-2xl border">
            <h3>Why use PixelDrift’s PDF Splitter?</h3>

            <p>
              Splitting PDF files is essential when you need to extract specific
              pages, share only relevant sections, or reorganize documents.
              PixelDrift’s PDF splitter gives you complete control with zero
              quality loss and maximum privacy.
            </p>

            <ul>
              <li>Extract individual pages or page ranges from PDFs</li>
              <li>Split PDFs into smaller, clean documents</li>
              <li>No signup required and completely free</li>
              <li>Preserves original formatting and clarity</li>
              <li>Privacy-first processing with no file storage</li>
            </ul>

            <p>
              Whether you’re working with contracts, reports, or study material,
              PixelDrift makes splitting PDFs simple, fast, and reliable.
            </p>
          </article>

        </div>
      </section>

    </ToolLayout>
  );
}
