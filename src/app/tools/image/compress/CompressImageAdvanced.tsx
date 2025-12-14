"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { UploadCloud, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

/* --------------------------------------------------
   TYPES
-------------------------------------------------- */

type OutputFormat = "jpeg" | "png" | "webp";

/* --------------------------------------------------
   UTILS – CLIENT SIZE ESTIMATION
-------------------------------------------------- */

function estimateCompressedSize(
  fileSize: number,
  quality: number,
  resizePercent: number,
  format: OutputFormat
): number {
  const resizeFactor = Math.pow(resizePercent / 100, 2);

  let formatFactor = 1;
  if (format === "jpeg") formatFactor = quality / 100;
  if (format === "webp") formatFactor = quality / 110;
  if (format === "png") formatFactor = 0.85;

  return fileSize * resizeFactor * formatFactor;
}

/* --------------------------------------------------
   COMPONENT
-------------------------------------------------- */

export default function CompressImageAdvanced() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimateMB, setEstimateMB] = useState<number | null>(null);

  // Settings
  const [quality, setQuality] = useState(75);
  const [resizePercent, setResizePercent] = useState(100);
  const [maxWidth, setMaxWidth] = useState<number | "">("");
  const [maxHeight, setMaxHeight] = useState<number | "">("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpeg");
  const [keepMetadata, setKeepMetadata] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* --------------------------------------------------
     MEMOIZED QUERY PARAMS
  -------------------------------------------------- */
  const queryParams = useMemo(() => {
    const p = new URLSearchParams({
      quality: String(quality),
      resize_percent: String(resizePercent),
      format: outputFormat,
      keep_metadata: String(keepMetadata),
    });

    if (maxWidth !== "") p.set("max_width", String(maxWidth));
    if (maxHeight !== "") p.set("max_height", String(maxHeight));
    return p;
  }, [quality, resizePercent, outputFormat, keepMetadata, maxWidth, maxHeight]);

  /* --------------------------------------------------
     ESTIMATE SIZE ON SETTINGS CHANGE
  -------------------------------------------------- */
  useEffect(() => {
    if (!file) {
      setEstimateMB(null);
      return;
    }

    const estimatedBytes = estimateCompressedSize(
      file.size,
      quality,
      resizePercent,
      outputFormat
    );

    setEstimateMB(estimatedBytes / 1024 / 1024);
  }, [file, quality, resizePercent, outputFormat]);

  /* --------------------------------------------------
     FILE HANDLING
  -------------------------------------------------- */
  const handleFileSelect = (files: FileList | null) => {
    if (!files?.length) return;

    const f = files[0];
    if (!f.type.startsWith("image/")) {
      toast.error("Please upload a valid image.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const resetForm = () => {
    abortRef.current?.abort();
    if (preview) URL.revokeObjectURL(preview);

    setFile(null);
    setPreview(null);
    setProgress(0);
    setEstimateMB(null);
    setLoading(false);
  };

  /* --------------------------------------------------
     COMPRESS IMAGE WITH PROGRESS
  -------------------------------------------------- */
  const compressImage = async (): Promise<void> => {
    if (!file) {
      toast.error("Select an image first");
      return;
    }

    setLoading(true);
    setProgress(5);
    toast.loading("Compressing image...", { id: "compress" });

    abortRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/image/compress-image-advanced?${queryParams.toString()}`,
        {
          method: "POST",
          body: formData,
          signal: abortRef.current.signal,
        }
      );

      if (!res.ok) throw new Error(`Compression failed (${res.status})`);
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const contentLength = Number(res.headers.get("Content-Length")) || 0;

      let received = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          chunks.push(value);
          received += value.length;

          if (contentLength > 0) {
            setProgress(30 + Math.round((received / contentLength) * 60));
          }
        }
      }

      const blob = new Blob(chunks as BlobPart[]);

      setProgress(95);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed.${outputFormat === "jpeg" ? "jpg" : outputFormat}`;
      a.click();

      toast.success(
        `Compressed to ${(blob.size / 1024 / 1024).toFixed(2)} MB`,
        { id: "compress" }
      );

      setProgress(100);
      URL.revokeObjectURL(url);
      setTimeout(resetForm, 500);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;

      if (err instanceof Error) {
        toast.error(err.message, { id: "compress" });
      } else {
        toast.error("Something went wrong", { id: "compress" });
      }
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  return (
    <ToolLayout
      title="Compress Image (Advanced)"
      description="Advanced compression with live size estimation."
      sidebarCategory="image"
    >
      {/* UPLOAD */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="cursor-pointer rounded-2xl p-10 text-center border bg-white dark:bg-neutral-900"
      >
        {!preview ? (
          <>
            <UploadCloud className="mx-auto h-10 w-10 mb-3" />
            <p>Drag & drop image or click to upload</p>
          </>
        ) : (
          <motion.img
            src={preview}
            className="mx-auto max-h-64 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}

        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {/* ESTIMATE */}
      {estimateMB !== null && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Estimated output size: <b>{estimateMB.toFixed(2)} MB</b>
        </p>
      )}

      {/* SETTINGS */}
      {file && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <OptionSlider label={`Quality (${quality}%)`} min={1} max={100} value={quality} onChange={setQuality} disabled={loading} />
          <OptionSlider label={`Resize (${resizePercent}%)`} min={10} max={100} value={resizePercent} onChange={setResizePercent} disabled={loading} />
          <OptionInput label="Max Width" value={maxWidth} onChange={(v) => setMaxWidth(v ? Number(v) : "")} disabled={loading} />
          <OptionInput label="Max Height" value={maxHeight} onChange={(v) => setMaxHeight(v ? Number(v) : "")} disabled={loading} />
          <OptionSelect label="Format" value={outputFormat} onChange={setOutputFormat} disabled={loading} />
          <ToggleSwitch label="Keep Metadata" checked={keepMetadata} onChange={setKeepMetadata} disabled={loading} />
        </div>
      )}

      {/* PROGRESS */}
      {loading && (
        <div className="mt-8 w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* BUTTON */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={compressImage}
          disabled={!file || loading}
          className="px-7 py-3 rounded-xl bg-blue-600 text-white flex items-center gap-2 disabled:opacity-60"
        >
          <Download size={18} />
          {loading ? "Processing..." : "Download"}
        </button>
      </div>
    </ToolLayout>
  );
}

/* --------------------------------------------------
   REUSABLE COMPONENTS (STRICT SAFE)
-------------------------------------------------- */

interface OptionSliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

function OptionSlider({
  label,
  min,
  max,
  value,
  onChange,
  disabled = false,
}: OptionSliderProps) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

interface OptionInputProps {
  label: string;
  value: number | "";
  disabled?: boolean;
  onChange: (value: string) => void;
}

function OptionInput({
  label,
  value,
  onChange,
  disabled = false,
}: OptionInputProps) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <input
        type="number"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-xl border"
      />
    </div>
  );
}

interface OptionSelectProps {
  label: string;
  value: OutputFormat;
  disabled?: boolean;
  onChange: (value: OutputFormat) => void;
}

function OptionSelect({
  label,
  value,
  onChange,
  disabled = false,
}: OptionSelectProps) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as OutputFormat)}
        className="w-full px-4 py-2 rounded-xl border"
      >
        <option value="jpeg">JPEG</option>
        <option value="png">PNG</option>
        <option value="webp">WebP</option>
      </select>
    </div>
  );
}

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

function ToggleSwitch({
  label,
  checked,
  onChange,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full transition ${
          checked ? "translate-x-5" : ""
        }`}
      />
      <span className="ml-14 text-sm">{label}</span>
    </button>
  );
}
