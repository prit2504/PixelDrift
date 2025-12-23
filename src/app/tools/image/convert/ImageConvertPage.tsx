"use client";

import { useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

/* ---------------- TYPES ---------------- */

type OutputFormat = "jpeg" | "png" | "webp" | "tiff";

interface ImageItem {
  file: File;
  url: string;
  name: string;
}

/* ---------------- COMPONENT ---------------- */

export default function ImageConvertPage() {
  const [files, setFiles] = useState<ImageItem[]>([]);
  const [format, setFormat] = useState<OutputFormat>("jpeg");
  const [rename, setRename] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------------- FILE HANDLING ---------------- */

  const handleFiles = (fileList: FileList) => {
    const items: ImageItem[] = Array.from(fileList)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({
        file: f,
        url: URL.createObjectURL(f),
        name: f.name,
      }));

    if (!items.length) {
      toast.error("Upload valid image files");
      return;
    }

    setFiles((prev) => [...prev, ...items]);
  };

  const removeFile = (name: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.name === name);
      if (file) URL.revokeObjectURL(file.url);
      return prev.filter((f) => f.name !== name);
    });
  };

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.url));
    setFiles([]);
    setRename("");
  };

  /* ---------------- CONVERT ---------------- */

  const convertImages = async () => {
    if (!files.length) return toast.error("Upload at least one image");

    setLoading(true);

    const form = new FormData();
    files.forEach((f) => form.append("files", f.file));
    form.append("out_format", format);
    if (rename.trim()) form.append("rename_to", rename.trim());

    try {
      const res = await fetch("/api/image/convert", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Conversion failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download =
        files.length === 1
          ? `${rename || files[0].name.split(".")[0]}.${format}`
          : "converted-images.zip";

      a.click();
      URL.revokeObjectURL(url);
      clearAll();

      toast.success("Images converted successfully");
    } catch {
      toast.error("Failed to convert images");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-[9999]">
          <Loader2 className="animate-spin text-white" size={48} />
          <p className="text-white mt-4 text-lg">Converting images…</p>
        </div>
      )}

      <ToolLayout
        title="Convert Image Format"
        description="Convert images to JPG, PNG, WebP or TIFF."
        sidebarCategory="image"
      >
        <h1 className="sr-only">
          Image Converter Online – Free & Secure
        </h1>

        {/* HOW TO */}
        <section className="mb-10 rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-6">
          <h2 className="font-bold mb-3 text-lg">How to Convert Images</h2>
          <ol className="list-decimal ml-5 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Upload one or more images</li>
            <li>Select output format</li>
            <li>Optional: rename output files</li>
            <li>Convert & download instantly</li>
          </ol>
        </section>

        {/* UPLOAD */}
        <section
          className={`cursor-pointer rounded-2xl p-10 text-center border-2 border-dashed transition
            ${
              dragging
                ? "border-blue-600 bg-blue-50 dark:bg-neutral-800"
                : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <UploadCloud className="mx-auto h-12 w-12 mb-3 text-blue-600" />
          <p className="text-neutral-600 dark:text-neutral-400">
            Drag & drop images or click to upload
          </p>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </section>

        {/* PREVIEW */}
        {files.length > 0 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((item) => (
              <motion.div
                key={item.name}
                layout
                className="relative rounded-xl overflow-hidden border bg-neutral-50 dark:bg-neutral-900"
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => removeFile(item.name)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
                <div className="px-2 py-1 text-xs truncate">
                  {item.name}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* OPTIONS */}
        <div className="mt-8 space-y-4 max-w-md">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as OutputFormat)}
            className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-neutral-900"
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
            <option value="tiff">TIFF</option>
          </select>

          <input
            type="text"
            placeholder="Rename output (optional)"
            value={rename}
            onChange={(e) => setRename(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-neutral-900"
          />
        </div>

        {/* ACTIONS */}
        {files.length > 0 && (
          <div className="mt-8 flex gap-4">
            <button
              onClick={convertImages}
              disabled={loading}
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Convert Images
            </button>

            <button
              onClick={clearAll}
              className="px-8 py-4 rounded-xl border"
            >
              Clear
            </button>
          </div>
        )}

        {/* SEO CONTENT */}
        <section className="mt-24 border-t pt-16">
          <header className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-3">
              Convert Images Online Without Quality Loss
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Batch convert images for web, design and productivity.
            </p>
          </header>

          <article className="prose prose-neutral dark:prose-invert max-w-none bg-neutral-50 dark:bg-neutral-900 p-8 rounded-2xl border">
            <ul>
              <li>Convert JPG, PNG, WebP and TIFF images</li>
              <li>Batch conversion supported</li>
              <li>No signup required</li>
              <li>Privacy-first processing</li>
            </ul>
          </article>
        </section>
      </ToolLayout>
    </>
  );
}
