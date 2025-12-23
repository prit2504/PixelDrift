"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "react-hot-toast";
import { UploadCloud, FileDown } from "lucide-react";
import { motion } from "framer-motion";

/* ---------------- TYPES ---------------- */

interface OptionSelectProps<T extends string | number> {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}

interface OptionSliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  note?: string;
  onChange: (v: number) => void;
}

interface OptionInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  note?: string;
  type?: string;
}

interface ToggleSwitchProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

/* ---------------- COMPONENT ---------------- */

export default function CompressPDFAdvancedPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [quality, setQuality] = useState(60);
  const [dpi, setDpi] = useState(120);
  const [grayscale, setGrayscale] = useState(false);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [maxPages, setMaxPages] = useState("");

  const [originalSizeMB, setOriginalSizeMB] = useState<number | null>(null);
  const [compressedSizeMB, setCompressedSizeMB] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------------- FILE ---------------- */

  const handleFile = (selected: FileList | null) => {
    if (!selected?.length) return;
    const f = selected[0];

    if (f.type !== "application/pdf") {
      toast.error("Upload a valid PDF file");
      return;
    }

    setFile(f);
    setOriginalSizeMB(f.size / 1024 / 1024);
    setCompressedSizeMB(null);
  };

  /* ---------------- COMPRESS ---------------- */

  const compressPDF = async () => {
    if (!file) return toast.error("Upload a PDF first");

    setLoading(true);
    toast.loading("Compressing PDF…", { id: "compress" });

    const formData = new FormData();
    formData.append("file", file);

    const params = new URLSearchParams({
      quality: String(quality),
      image_dpi: String(dpi),
      grayscale: String(grayscale),
      remove_metadata: String(removeMetadata),
    });

    if (maxPages.trim()) params.append("max_pages", maxPages.trim());

    try {
      const res = await fetch(
        `/api/pdf/compress?${params.toString()}`,
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("Compression failed");

      const blob = await res.blob();
      setCompressedSizeMB(blob.size / 1024 / 1024);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed.pdf";
      a.click();
      URL.revokeObjectURL(url);

      toast.success("PDF compressed successfully", { id: "compress" });
    } catch (err) {
      toast.error("Compression failed", { id: "compress" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <ToolLayout
      title="Compress PDF"
      description="Compress PDF files with advanced quality and DPI controls."
      sidebarCategory="pdf"
    >
      <h1 className="sr-only">
        Compress PDF Online – Free & High Quality
      </h1>

      {/* HOW TO */}
      <section className="mb-10 rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-6">
        <h2 className="font-bold mb-3 text-lg">How to Compress PDF</h2>
        <ol className="list-decimal ml-5 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
          <li>Upload a PDF file</li>
          <li>Adjust quality and DPI settings</li>
          <li>Optional: grayscale or remove metadata</li>
          <li>Compress & download instantly</li>
        </ol>
      </section>

      {/* UPLOAD */}
      <section
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer rounded-2xl p-10 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-blue-500 transition"
      >
        <UploadCloud className="mx-auto h-12 w-12 mb-3 text-blue-600" />
        <p className="text-neutral-600 dark:text-neutral-400">
          Drag & drop PDF or click to upload
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          hidden
          onChange={(e) => handleFile(e.target.files)}
        />
      </section>

      {/* FILE INFO */}
      {file && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-4 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{file.name}</p>
            <p className="text-xs text-neutral-500">
              Original: {originalSizeMB?.toFixed(2)} MB
            </p>
            {compressedSizeMB && (
              <p className="text-xs text-green-600">
                Compressed: {compressedSizeMB.toFixed(2)} MB
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* SETTINGS */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <OptionSlider
          label={`Compression Quality (${quality})`}
          min={10}
          max={95}
          value={quality}
          onChange={setQuality}
          note="Lower quality = smaller size"
        />

        <OptionSelect
          label="Render DPI"
          value={dpi}
          onChange={(v) => setDpi(Number(v))}
          options={[
            { value: 72, label: "72 – Small file" },
            { value: 120, label: "120 – Balanced" },
            { value: 150, label: "150 – Good quality" },
            { value: 300, label: "300 – High detail" },
          ]}
        />

        <ToggleSwitch
          label="Convert to grayscale"
          description="Great for scanned documents"
          checked={grayscale}
          onChange={setGrayscale}
        />

        <ToggleSwitch
          label="Remove metadata"
          description="Improves privacy & reduces size"
          checked={removeMetadata}
          onChange={setRemoveMetadata}
        />

        <OptionInput
          label="Max pages (optional)"
          value={maxPages}
          onChange={setMaxPages}
          placeholder="e.g. 5"
          type="number"
        />
      </div>

      {/* ACTION */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={compressPDF}
          disabled={loading || !file}
          className="px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-3"
        >
          <FileDown size={20} />
          {loading ? "Compressing…" : "Compress PDF"}
        </button>
      </div>

      {/* SEO CONTENT */}
      <section className="mt-24 border-t pt-16">
  <div className="max-w-5xl mx-auto space-y-16">

    {/* HEADER */}
    <header className="text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
        Advanced PDF Compression Online
      </h2>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
        Reduce PDF file size intelligently without sacrificing readability,
        layout, or image clarity.
      </p>
    </header>

    {/* FEATURE GRID */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
        <h3 className="font-bold text-xl mb-3">High-Quality Compression</h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          PixelDrift uses advanced image recompression techniques to significantly
          reduce PDF size while keeping text sharp and images clear — ideal for
          documents, reports, and scanned PDFs.
        </p>
      </div>

      <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
        <h3 className="font-bold text-xl mb-3">Smart DPI & Image Control</h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          Fine-tune output quality using DPI and compression level controls.
          Lower DPI for email sharing, or higher DPI for print-ready documents.
        </p>
      </div>

      <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
        <h3 className="font-bold text-xl mb-3">Perfect for Scanned PDFs</h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          Grayscale conversion and metadata removal dramatically reduce file size
          for scanned PDFs, invoices, and paperwork — without breaking layout.
        </p>
      </div>

      <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
        <h3 className="font-bold text-xl mb-3">Privacy-First & Secure</h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          Your PDFs are processed securely and never stored. Files are removed
          immediately after compression, ensuring complete privacy.
        </p>
      </div>
    </div>

    {/* SEO-RICH CONTENT BLOCK */}
    <article className="prose prose-neutral dark:prose-invert max-w-none bg-neutral-50 dark:bg-neutral-900 p-10 rounded-2xl border">
      <h3>Why use PixelDrift’s Advanced PDF Compressor?</h3>

      <p>
        Large PDF files slow down workflows, email sharing, and website performance.
        PixelDrift’s advanced PDF compression tool helps you reduce PDF size online
        using professional-grade optimization techniques — completely free.
      </p>

      <ul>
        <li>Compress PDF files without visible quality loss</li>
        <li>Optimize scanned documents and image-heavy PDFs</li>
        <li>Control DPI, image quality, grayscale, and metadata</li>
        <li>No signup required — works directly in your browser</li>
        <li>Improves storage efficiency and sharing speed</li>
      </ul>

      <p>
        Whether you’re compressing PDFs for email, web upload, or long-term storage,
        PixelDrift gives you full control over file size and output quality.
      </p>
    </article>

  </div>
</section>

    </ToolLayout>
  );
}

/* ---------------- REUSABLE UI ---------------- */

function OptionSelect<T extends string | number>({
  label,
  value,
  onChange,
  options,
}: OptionSelectProps<T>) {
  return (
    <div>
      <label className="text-sm font-semibold mb-1 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-neutral-900"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function OptionSlider({
  label,
  min,
  max,
  value,
  onChange,
  note,
}: OptionSliderProps) {
  return (
    <div>
      <label className="text-sm font-semibold block mb-2">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
      {note && <p className="text-xs text-neutral-500 mt-1">{note}</p>}
    </div>
  );
}

function OptionInput({
  label,
  value,
  onChange,
  placeholder,
  note,
  type = "text",
}: OptionInputProps) {
  return (
    <div>
      <label className="text-sm font-semibold block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-neutral-900"
      />
      {note && <p className="text-xs text-neutral-500 mt-1">{note}</p>}
    </div>
  );
}

function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
}: ToggleSwitchProps) {
  return (
    <div className="flex items-start gap-3">
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-neutral-300 dark:bg-neutral-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full transition ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>
    </div>
  );
}
