"use client";

import { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "react-hot-toast";
import { Reorder } from "framer-motion";
import { UploadCloud, FileText, GripVertical, X } from "lucide-react";

/* ---------------------------------------------
   TYPES
---------------------------------------------- */

type PageSize = "A4" | "LETTER" | "FIT";
type Orientation = "portrait" | "landscape";
type FitMode = "contain" | "cover";

interface FileItem {
  id: string;
  file: File;
  preview: string;
}

/* ---------------------------------------------
   MAIN COMPONENT
---------------------------------------------- */

export default function ImageToPDFPage() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  // PDF options
  const [pageSize, setPageSize] = useState<PageSize>("A4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState<number>(10);
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const [dpi, setDpi] = useState<number>(120);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------------------------------------------
     CLEANUP (ObjectURL safety)
  ---------------------------------------------- */

  useEffect(() => {
    return () => {
      items.forEach((i) => URL.revokeObjectURL(i.preview));
    };
  }, [items]);

  /* ---------------------------------------------
     FILE HANDLING
  ---------------------------------------------- */

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;

    const images = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );

    if (!images.length) {
      toast.error("Please upload valid image files.");
      return;
    }

    const mapped: FileItem[] = images.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setItems((prev) => [...prev, ...mapped]);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });
  }

  /* ---------------------------------------------
     GENERATE PDF
  ---------------------------------------------- */

  async function generatePDF() {
    if (!items.length) {
      toast.error("Please upload at least one image.");
      return;
    }

    setLoading(true);
    toast.loading("Generating PDF…", { id: "pdf" });

    const form = new FormData();
    items.forEach((i) => form.append("files", i.file));

    const params = new URLSearchParams({
      page_size: pageSize,
      orientation,
      margin: String(margin),
      dpi: String(dpi),
      fit_mode: fitMode,
    });

    try {
      const res = await fetch(
        "/api/pdf/image-to-pdf",
        { method: "POST", body: form }
      );

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted_images.pdf";
      a.click();

      URL.revokeObjectURL(url);
      toast.success("PDF created successfully!", { id: "pdf" });
    } catch {
      toast.error("Failed to create PDF", { id: "pdf" });
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------------------------
     UI
  ---------------------------------------------- */

  return (
    <ToolLayout
      title="Image to PDF"
      description="Convert images into a clean, high-quality PDF with advanced layout controls."
      sidebarCategory="pdf"
    >
      {/* UPLOAD */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="cursor-pointer rounded-2xl p-10 text-center border-2 border-dashed"
      >
        <UploadCloud className="mx-auto h-12 w-12 text-blue-600 mb-3" />
        <p className="text-sm">Drag & drop images or click to upload</p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* REORDER LIST */}
      {items.length > 0 && (
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="mt-10 space-y-4"
        >
          {items.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className="flex items-center gap-4 p-4 rounded-xl border bg-white"
            >
              <GripVertical className="text-gray-400 cursor-grab" />

              <img
                src={item.preview}
                className="w-16 h-16 object-cover rounded-lg"
                alt=""
              />

              <p className="flex-1 text-sm font-medium">{item.file.name}</p>

              <button
                onClick={() => removeItem(item.id)}
                className="p-2 rounded-lg hover:bg-red-100"
              >
                <X className="text-red-500" />
              </button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* OPTIONS */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <OptionSelect<PageSize>
          label="Page Size"
          value={pageSize}
          onChange={setPageSize}
          options={[
            { value: "A4", label: "A4" },
            { value: "LETTER", label: "US Letter" },
            { value: "FIT", label: "Fit to Image" },
          ]}
        />

        <OptionSelect<Orientation>
          label="Orientation"
          value={orientation}
          onChange={setOrientation}
          options={[
            { value: "portrait", label: "Portrait" },
            { value: "landscape", label: "Landscape" },
          ]}
        />

        <OptionSlider
          label={`Margin (${margin}px)`}
          min={0}
          max={50}
          value={margin}
          onChange={setMargin}
        />

        <OptionSelect<number>
          label="Image DPI"
          value={dpi}
          onChange={setDpi}
          options={[
            { value: 72, label: "72 — Screen" },
            { value: 120, label: "120 — Balanced" },
            { value: 150, label: "150 — Good" },
            { value: 300, label: "300 — High Quality" },
          ]}
        />

        <OptionSelect<FitMode>
          label="Fit Mode"
          value={fitMode}
          onChange={setFitMode}
          options={[
            { value: "contain", label: "Contain (No Crop)" },
            { value: "cover", label: "Cover (Crop)" },
          ]}
        />
      </div>

      {/* GENERATE */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={generatePDF}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white flex items-center gap-2"
        >
          <FileText size={18} />
          {loading ? "Generating…" : "Create PDF"}
        </button>
      </div>
    </ToolLayout>
  );
}

/* ---------------------------------------------
   REUSABLE COMPONENTS
---------------------------------------------- */

interface SelectOption<T> {
  value: T;
  label: string;
}

function OptionSelect<T>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: SelectOption<T>[];
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <select
        value={String(value)}
        onChange={(e) =>
          onChange(
            options.find((o) => String(o.value) === e.target.value)!.value
          )
        }
        className="w-full px-4 py-2 rounded-xl border"
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
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
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        className="w-full mt-3 accent-blue-600"
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
