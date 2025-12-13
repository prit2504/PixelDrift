"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "react-hot-toast";
import { Reorder } from "framer-motion";

import {
  UploadCloud,
  FileText,
  GripVertical,
  X,
} from "lucide-react";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_FILES = 20;

  /* -------------------------
      Handle File Upload
  ------------------------- */
  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;

    const valid = Array.from(selected).filter(
      (f) => f.type === "application/pdf"
    );

    if (valid.length === 0)
      return toast.error("Only PDF files are allowed.");

    if (files.length + valid.length > MAX_FILES)
      return toast.error(`Max ${MAX_FILES} files allowed.`);

    setFiles((prev) => [...prev, ...valid]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* -------------------------
      Drag & Drop
  ------------------------- */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  /* -------------------------
      Merge PDFs
  ------------------------- */
  const mergePDFs = async () => {
    if (files.length < 2) {
      toast.error("Please upload at least 2 PDF files.");
      return;
    }

    setLoading(true);
    toast.loading("Merging PDFs...", { id: "merge" });

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdf/merge-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();

      toast.success("PDF merged successfully!", { id: "merge" });
    } catch {
      toast.error("Failed to merge PDF.", { id: "merge" });
    }

    setLoading(false);
  };

  return (
    <ToolLayout
      title="Merge PDF Files"
      description="Combine multiple PDFs into a single clean document. Reorder files before merging."
      sidebarCategory="pdf"
    >

      {/* Upload Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="
          border-2 border-dashed rounded-2xl px-8 py-10 text-center cursor-pointer
          bg-white dark:bg-neutral-800 shadow-sm 
          border-gray-300 dark:border-neutral-700
          hover:border-blue-500/60 transition
        "
      >
        <UploadCloud className="mx-auto h-12 w-12 mb-3 text-gray-500 dark:text-gray-400" />

        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
          Drag & drop PDF files here, or click to browse
        </p>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Supports up to {MAX_FILES} files
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">
            Selected Files ({files.length})
          </h3>

          <Reorder.Group
            axis="y"
            values={files}
            onReorder={setFiles}
            className="space-y-3"
          >
            {files.map((file, index) => (
              <Reorder.Item
                key={file.name + index}
                value={file}
                className="
                  flex items-center justify-between
                  p-4 rounded-xl bg-white dark:bg-neutral-800
                  border border-gray-200 dark:border-neutral-700
                  shadow-sm
                "
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="text-gray-400 cursor-grab" />

                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeFile(index)}
                  className="
                    p-2 rounded-lg 
                    hover:bg-red-100 dark:hover:bg-red-900 transition
                  "
                >
                  <X size={18} className="text-red-500" />
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {/* Merge Button */}
      <div className="mt-10 flex flex-col items-center">
        <button
          onClick={mergePDFs}
          disabled={loading || files.length < 2}
          className="
            bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
            text-white px-6 py-3 rounded-xl shadow-md
            font-medium flex items-center gap-2 transition active:scale-95
          "
        >
          <FileText size={18} />
          {loading ? "Merging..." : "Merge PDFs"}
        </button>

        {/* Progress Bar */}
        {loading && (
          <div className="mt-4 w-full max-w-md h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 animate-[progress_1.2s_linear_infinite]" />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
