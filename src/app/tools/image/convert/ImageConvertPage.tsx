"use client";

import { useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ImageConvertPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [format, setFormat] = useState("jpeg");
  const [rename, setRename] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ----------------------------
      FILE HANDLING
  ----------------------------- */
  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
      name: f.name,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.url));
    setFiles([]);
    setRename("");
  };

  /* ----------------------------
      CONVERSION HANDLER
  ----------------------------- */
  const convertImages = async () => {
    if (files.length === 0) return toast.error("Upload at least one image.");

    setLoading(true);

    const form = new FormData();
    files.forEach((f) => form.append("files", f.file));
    form.append("out_format", format);

    if (rename.trim() !== "") {
      form.append("rename_to", rename);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/image/convert-image`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to convert images.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      a.download =
        files.length === 1
          ? (rename || files[0].name.split(".")[0]) + "." + format
          : "converted_images.zip";

      a.click();

      window.URL.revokeObjectURL(url);
      clearAll();
      toast.success("Images converted successfully!");
    } catch {
      toast.error("Failed to convert images.");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------
      UI STARTS HERE
  ----------------------------- */
  return (
    <>
      {/* FULLSCREEN LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-[9999]">
          <Loader2 className="animate-spin text-white" size={48} />
          <p className="text-white mt-4 text-lg font-medium">
            Converting images…
          </p>
        </div>
      )}

      <ToolLayout
        title="Convert Image Format"
        description="Convert images to JPG, PNG, WebP, BMP, or TIFF. Supports batch conversion and custom file naming."
        sidebarCategory="image"
      >
        {/* UPLOAD BOX */}
        <div
          className={`
            cursor-pointer rounded-2xl p-10 text-center transition
            border-2 border-dashed 
            ${dragging ? "border-blue-600 bg-blue-50 dark:bg-neutral-800" : "border-gray-300 dark:border-neutral-700"}
            bg-gradient-to-b from-white to-gray-50 dark:from-neutral-800 dark:to-neutral-900
            hover:shadow-md shadow-sm
          `}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <div className="mx-auto bg-blue-50 dark:bg-blue-900/30 p-5 rounded-2xl w-fit mb-4">
            <UploadCloud className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>

          <p className="text-base font-medium text-gray-700 dark:text-gray-200">
            Drag & drop images here, or click to browse
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            JPG, PNG, WebP, BMP, TIFF supported
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>

        {/* FILE PREVIEW GRID */}
        {files.length > 0 && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((item, idx) => (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative border rounded-xl overflow-hidden shadow-sm bg-white dark:bg-neutral-800"
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-32 object-cover"
                />

                <button
                  onClick={() => removeFile(item.name)}
                  className="
                    absolute top-2 right-2 bg-white dark:bg-neutral-900
                    rounded-full p-1 shadow
                  "
                >
                  <X size={16} className="text-red-500" />
                </button>

                <div className="px-2 py-1 text-xs truncate text-gray-700 dark:text-gray-300">
                  {item.name}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* OPTIONS PANEL */}
        <div className="mt-10 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold">Conversion Options</h2>

          {/* OUTPUT FORMAT */}
          <div>
            <label className="text-sm font-medium">Output Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="
                w-full mt-2 px-4 py-2.5 rounded-xl border text-sm
                bg-gray-50 dark:bg-neutral-900
                border-gray-300 dark:border-neutral-700
                focus:ring-2 focus:ring-blue-500
                transition
              "
            >
              <option value="jpeg">JPG / JPEG</option>
              <option value="png">PNG (Transparent)</option>
              <option value="webp">WebP (Modern)</option>
              <option value="bmp">BMP</option>
              <option value="tiff">TIFF</option>
            </select>
          </div>

          {/* RENAME OPTION */}
          <div>
            <label className="text-sm font-medium">Rename Output (Optional)</label>
            <input
              type="text"
              placeholder="Example: vacation-photo"
              value={rename}
              onChange={(e) => setRename(e.target.value)}
              className="
                w-full mt-2 px-4 py-2.5 rounded-xl border text-sm
                bg-gray-50 dark:bg-neutral-900
                border-gray-300 dark:border-neutral-700
                focus:ring-2 focus:ring-blue-500
              "
            />
            <p className="text-xs mt-1 text-gray-500">
              Multiple files → <b>name_1</b>, <b>name_2</b>, etc.
            </p>
          </div>
        </div>

        {/* ACTION BUTTON */}
        {files.length > 0 && (
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={convertImages}
              disabled={loading}
              className="
                px-6 py-3 rounded-xl shadow-md
                bg-blue-600 hover:bg-blue-700 text-white font-medium
                disabled:opacity-50 active:scale-95 transition
              "
            >
              Convert Images
            </button>

            <button
              onClick={clearAll}
              className="
                px-6 py-3 rounded-xl border border-gray-300 dark:border-neutral-700
                bg-white dark:bg-neutral-800
              "
            >
              Clear
            </button>
          </div>
        )}
      </ToolLayout>
    </>
  );
}
