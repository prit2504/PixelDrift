"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "react-hot-toast";
import { UploadCloud, FileDown } from "lucide-react";
import { motion } from "framer-motion";

/* -------------------------------------------------------
   TYPES FOR REUSABLE COMPONENTS
-------------------------------------------------------- */

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

/* -------------------------------------------------------
   MAIN PAGE COMPONENT
-------------------------------------------------------- */

export default function CompressPDFAdvancedPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [quality, setQuality] = useState<number>(60);
  const [dpi, setDpi] = useState<number>(120);
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const [removeMetadata, setRemoveMetadata] = useState<boolean>(true);
  const [maxPages, setMaxPages] = useState<string>("");

  const [originalSizeMB, setOriginalSizeMB] = useState<number | null>(null);
  const [compressedSizeMB, setCompressedSizeMB] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* -------------------------------------------------------
     FILE HANDLER
  -------------------------------------------------------- */
  const handleFile = (selected: FileList | null) => {
    if (!selected?.length) return;
    const f = selected[0];

    if (f.type !== "application/pdf") {
      toast.error("Upload a valid PDF.");
      return;
    }

    setFile(f);
    setOriginalSizeMB(f.size / 1024 / 1024);
    setCompressedSizeMB(null);
  };

  /* -------------------------------------------------------
     COMPRESSION HANDLER
  -------------------------------------------------------- */
  const compressPDF = async () => {
    if (!file) {
      toast.error("Upload a PDF first.");
      return;
    }

    setLoading(true);
    toast.loading("Compressing PDF...", { id: "compress" });

    const formData = new FormData();
    formData.append("file", file);

    const params = new URLSearchParams({
      quality: String(quality),
      image_dpi: String(dpi),
      grayscale: String(grayscale),
      remove_metadata: String(removeMetadata),
    });

    if (maxPages.trim()) {
      params.append("max_pages", maxPages.trim());
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pdf/compress-pdf-advanced?${params.toString()}`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        throw new Error("Compression failed");
      }

      const blob = await res.blob();
      setCompressedSizeMB(blob.size / 1024 / 1024);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed_advanced.pdf";
      a.click();
      URL.revokeObjectURL(url);

      toast.success("PDF compressed successfully!", { id: "compress" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message, { id: "compress" });
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
     UI SECTION
  -------------------------------------------------------- */

  return (
    <ToolLayout
      title="Compress PDF"
      description="Fine-tune your PDF compression with quality, DPI, grayscale, metadata removal, and page limits."
      sidebarCategory="pdf"
    >
      {/* UPLOAD BOX */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files);
        }}
        className="
          cursor-pointer rounded-2xl p-10 text-center
          border border-gray-300 dark:border-neutral-700
          bg-gradient-to-b from-white to-gray-50
          dark:from-neutral-800 dark:to-neutral-900
          hover:shadow-md transition shadow-sm
        "
      >
        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl w-fit mx-auto mb-4">
          <UploadCloud className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>

        <p className="text-base font-medium">Drag & drop your PDF or click to browse</p>
        <p className="text-xs text-gray-500 mt-1">Secure • Fast • No storage</p>

        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => handleFile(e.target.files)}
        />
      </div>

      {/* FILE PREVIEW CARD */}
      {file && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            mt-8 p-4 rounded-xl border shadow-sm
            bg-white dark:bg-neutral-800
            flex justify-between items-center
          "
        >
          <div>
            <p className="font-semibold">{file.name}</p>

            <p className="text-xs text-gray-500 mt-1">
              Original: {originalSizeMB?.toFixed(2)} MB
            </p>

            {compressedSizeMB !== null && (
              <p className="text-xs text-green-600">
                Compressed: {compressedSizeMB.toFixed(2)} MB
              </p>
            )}
          </div>

          {compressedSizeMB !== null &&
            originalSizeMB &&
            compressedSizeMB < originalSizeMB && (
              <p className="text-xs text-gray-600">
                Saved{" "}
                {Math.round(
                  100 - (compressedSizeMB / originalSizeMB) * 100
                )}
                %
              </p>
            )}
        </motion.div>
      )}

      {/* ADVANCED SETTINGS */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <OptionSlider
          label={`Compression Quality (${quality})`}
          min={10}
          max={95}
          value={quality}
          onChange={setQuality}
          note="Lower = smaller size, lower clarity"
        />

        <OptionSelect
          label="Render DPI"
          value={dpi}
          onChange={(v) => setDpi(Number(v))}
          options={[
            { value: 72, label: "72 — Small file" },
            { value: 120, label: "120 — Balanced" },
            { value: 150, label: "150 — Good quality" },
            { value: 300, label: "300 — High detail" },
          ]}
        />

        <ToggleSwitch
          label="Convert to grayscale"
          description="Best for scanned PDFs, reduces size a lot."
          checked={grayscale}
          onChange={setGrayscale}
        />

        <ToggleSwitch
          label="Remove metadata"
          description="Removes author/title metadata for smaller file & privacy."
          checked={removeMetadata}
          onChange={setRemoveMetadata}
        />

        <OptionInput
          label="Max pages to compress (optional)"
          type="number"
          placeholder="e.g., 5"
          value={maxPages}
          onChange={setMaxPages}
          note="Leave blank to compress all pages."
        />
      </div>

      {/* COMPRESS BUTTON */}
      <div className="mt-12 flex flex-col items-center">
        <button
          disabled={loading || !file}
          onClick={compressPDF}
          className="
            px-7 py-3 rounded-xl bg-blue-600 text-white
            hover:bg-blue-700 disabled:bg-blue-400
            flex items-center gap-2 shadow-md active:scale-95 transition
          "
        >
          <FileDown size={18} />
          {loading ? "Compressing..." : "Start Compression"}
        </button>

        {loading && (
          <div className="mt-4 h-2 w-full max-w-md rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full bg-blue-600 animate-[progress_1.2s_linear_infinite]" />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

/* -------------------------------------------------------
   REUSABLE PREMIUM COMPONENTS (FULLY TYPED)
-------------------------------------------------------- */

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
        className="w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-neutral-900"
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

      {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
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
        className="w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-neutral-900"
      />

      {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
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
          checked ? "bg-blue-600" : "bg-gray-300 dark:bg-neutral-700"
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
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}
