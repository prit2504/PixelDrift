"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { UploadCloud, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

// ---------------------- Component ----------------------

export default function CompressImageAdvanced() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Settings
  const [quality, setQuality] = useState<number>(75);
  const [resizePercent, setResizePercent] = useState<number>(100);
  const [maxWidth, setMaxWidth] = useState<number | "">("");
  const [maxHeight, setMaxHeight] = useState<number | "">("");
  const [outputFormat, setOutputFormat] = useState<string>("jpeg");
  const [keepMetadata, setKeepMetadata] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files?.length) return;

    const f = files[0];
    if (!f.type.startsWith("image/")) {
      toast.error("Please upload a valid image.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(f);

    setFile(f);
    setPreview(url);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const resetForm = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setQuality(75);
    setResizePercent(100);
    setMaxWidth("");
    setMaxHeight("");
    setOutputFormat("jpeg");
    setKeepMetadata(false);
  };

  const compressImage = async () => {
    if (!file) return toast.error("Please select an image.");

    setLoading(true);
    toast.loading("Compressing image...", { id: "compress" });

    const params = new URLSearchParams({
      quality: String(quality),
      resize_percent: String(resizePercent),
      format: outputFormat,
      keep_metadata: keepMetadata ? "true" : "false",
    });

    if (maxWidth !== "") params.set("max_width", String(maxWidth));
    if (maxHeight !== "") params.set("max_height", String(maxHeight));

    try {
      const formData = new FormData();
      formData.append("file", file);


      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/image/compress-image-advanced?${params.toString()}`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Compression failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed.${ext}`;
      a.click();

      const originalMB = file.size / 1024 / 1024;
      const compressedMB = blob.size / 1024 / 1024;

      toast.success(
        `Compressed to ${compressedMB.toFixed(2)} MB (from ${originalMB.toFixed(
          2
        )} MB)`,
        { id: "compress" }
      );

      URL.revokeObjectURL(url);
      setTimeout(resetForm, 300);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Something went wrong.", { id: "compress" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Compress Image (Advanced)"
      description="Compress images with adjustable settings."
      sidebarCategory="image"
    >
      {/* PREMIUM UPLOAD BOX */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="
          cursor-pointer rounded-2xl p-10 text-center
          border border-gray-300 dark:border-neutral-700
          bg-gradient-to-b from-white to-gray-50
          dark:from-neutral-800 dark:to-neutral-900
          hover:shadow-md transition shadow-sm
        "
      >
        {!preview ? (
          <>
            <div className="mx-auto bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl w-fit mb-4">
              <UploadCloud className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>

            <p className="text-base font-medium text-gray-700 dark:text-gray-200">
              Drag & drop an image here, or click to browse
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supports JPG, PNG, WebP
            </p>
          </>
        ) : (
          <motion.img
            src={preview}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-h-64 rounded-xl shadow-md object-contain ring-1 ring-gray-200 dark:ring-neutral-700"
          />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {/* SETTINGS */}
      {file && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <OptionSlider
            label={`Quality (${quality}%)`}
            min={1}
            max={100}
            value={quality}
            onChange={setQuality}
            note="Lower quality reduces file size."
          />

          <OptionSlider
            label={`Resize Percentage (${resizePercent}%)`}
            min={10}
            max={100}
            value={resizePercent}
            onChange={setResizePercent}
            note="Proportional dimension scaling."
          />

          <OptionInput
            label="Max Width (px)"
            placeholder="Optional"
            type="number"
            value={maxWidth}
            onChange={(v) => setMaxWidth(v ? Number(v) : "")}
          />

          <OptionInput
            label="Max Height (px)"
            placeholder="Optional"
            type="number"
            value={maxHeight}
            onChange={(v) => setMaxHeight(v ? Number(v) : "")}
          />

          <OptionSelect
            label="Output Format"
            value={outputFormat}
            onChange={setOutputFormat}
            options={[
              { value: "jpeg", label: "JPEG" },
              { value: "webp", label: "WebP" },
              { value: "png", label: "PNG" },
            ]}
          />

          <ToggleSwitch
            label="Keep Metadata (EXIF)"
            description="Retains camera info, GPS, timestamps."
            checked={keepMetadata}
            onChange={setKeepMetadata}
          />
        </div>
      )}

      {/* BUTTON */}
      <div className="mt-12 flex flex-col items-center">
        <button
          onClick={compressImage}
          disabled={!file || loading}
          className="
            px-7 py-3 rounded-xl shadow-md
            bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
            text-white font-medium flex items-center gap-2
            transition active:scale-95
          "
        >
          <Download size={18} />
          {loading ? "Compressing..." : "Download Compressed Image"}
        </button>
      </div>
    </ToolLayout>
  );
}

// ---------------------- Reusable Components ----------------------

interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  note?: string;
}

function OptionSlider({ label, min, max, value, onChange, note }: SliderProps) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-3"
      />

      {note && <p className="text-xs mt-1">{note}</p>}
    </div>
  );
}

interface InputProps {
  label: string;
  type: string;
  value: number | "";
  onChange: (v: string) => void;
  placeholder?: string;
}

function OptionInput({
  label,
  type,
  value,
  onChange,
  placeholder,
}: InputProps) {
  return (
    <div>
      <label className="text-sm font-semibold mb-1 block">{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border"
      />
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

function OptionSelect({ label, value, onChange, options }: SelectProps) {
  return (
    <div>
      <label className="text-sm font-semibold mb-1 block">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border"
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

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
}: ToggleProps) {
  return (
    <div className="flex items-start gap-3">
      <button
        onClick={() => onChange(!checked)}
        className={`mt-1 w-11 h-6 rounded-full relative transition ${
          checked ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>

      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}
